-- =============================================
-- TeleTrade RPC Fix Migration
-- Fixes table name reference in process_payment_webhook
-- =============================================

-- Drop and recreate the function with correct table name
CREATE OR REPLACE FUNCTION process_payment_webhook(
  p_invoice_id text,
  p_payment_status text,
  p_actually_paid numeric,
  p_pay_currency text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER -- runs with elevated privileges
AS $$
DECLARE
  v_transaction record;
  v_subscriber_id uuid;
  v_client_id uuid;
  v_plan_id uuid;
  v_plan_duration int;
  v_bot_id uuid;
  v_new_sub_end timestamptz;
  v_result json;
BEGIN
  -- 1. Locking: Select transaction for update to prevent race conditions
  SELECT * INTO v_transaction
  FROM payment_transactions
  WHERE nowpayments_invoice_id = p_invoice_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('status', 'error', 'message', 'Transaction not found');
  END IF;

  -- 2. Idempotency Check
  IF v_transaction.payment_status = 'CONFIRMED' THEN
    RETURN json_build_object('status', 'success', 'message', 'Already confirmed', 'action', 'none');
  END IF;

  -- 3. Partial Payment Check (only if status is claiming to be finished/confirmed)
  IF p_payment_status = 'finished' OR p_payment_status = 'confirmed' THEN
    IF p_actually_paid < v_transaction.amount THEN
      -- Update to FAILED for partial payment
      UPDATE payment_transactions
      SET 
        payment_status = 'FAILED',
        updated_at = now()
      WHERE id = v_transaction.id;

      RETURN json_build_object('status', 'error', 'message', 'Partial payment detected', 'expected', v_transaction.amount, 'received', p_actually_paid);
    END IF;

    -- Update to CONFIRMED
    UPDATE payment_transactions
    SET 
      payment_status = 'CONFIRMED',
      confirmed_at = now(),
      updated_at = now()
    WHERE id = v_transaction.id;

    -- 4. Subscription Activation / Extension
    IF v_transaction.payment_type = 'SUBSCRIBER_SUBSCRIPTION' THEN
      v_subscriber_id := v_transaction.subscriber_id;
      v_plan_id := v_transaction.plan_id;

      -- Get plan duration
      SELECT duration_days, bot_id INTO v_plan_duration, v_bot_id
      FROM subscription_plans
      WHERE id = v_plan_id;

      -- Calculate new end date
      -- If current sub is active and in future, add to it. Else start from now.
      SELECT 
        CASE 
          WHEN subscription_status = 'ACTIVE' AND subscription_end_date > now() 
          THEN subscription_end_date + (v_plan_duration || ' days')::interval
          ELSE now() + (v_plan_duration || ' days')::interval
        END
      INTO v_new_sub_end
      FROM subscribers
      WHERE id = v_subscriber_id;
      
      -- Fallback if new subscriber
      IF v_new_sub_end IS NULL THEN
         v_new_sub_end := now() + (v_plan_duration || ' days')::interval;
      END IF;

      -- Update subscriber
      UPDATE subscribers
      SET
        subscription_status = 'ACTIVE',
        subscription_start_date = COALESCE(subscription_start_date, now()),
        subscription_end_date = v_new_sub_end,
        subscription_plan_id = v_plan_id,
        updated_at = now()
      WHERE id = v_subscriber_id;
      
      -- Log Access Grant (System) - FIXED: Using correct table name
      INSERT INTO access_control_logs (subscriber_id, bot_id, action, performed_by, reason)
      VALUES (v_subscriber_id, v_bot_id, 'GRANT', 'SYSTEM', 'Payment Confirmed');

      RETURN json_build_object('status', 'success', 'action', 'activated_subscriber', 'end_date', v_new_sub_end);

    ELSIF v_transaction.payment_type = 'PLATFORM_SUBSCRIPTION' THEN
      -- Client Subscription Logic
      v_client_id := v_transaction.client_id;
      
      -- Get plan duration for platform subscription
      SELECT duration_days INTO v_plan_duration
      FROM subscription_plans
      WHERE id = v_transaction.plan_id;
      
      -- Default to 30 days if not found
      IF v_plan_duration IS NULL THEN
        v_plan_duration := 30;
      END IF;
      
      UPDATE clients
      SET
        status = 'ACTIVE',
        platform_subscription_plan_id = v_transaction.plan_id,
        platform_subscription_start = COALESCE(platform_subscription_start, now()),
        platform_subscription_end = now() + (v_plan_duration || ' days')::interval,
        updated_at = now()
      WHERE id = v_client_id;

      RETURN json_build_object('status', 'success', 'action', 'activated_client');
    END IF;

  ELSE
    -- Handle other statuses (confirming, waiting, etc)
    -- Just update the transaction, do not activate
    UPDATE payment_transactions
    SET 
      payment_status = 
        CASE 
           WHEN p_payment_status = 'waiting' THEN 'PENDING'
           WHEN p_payment_status = 'confirming' THEN 'CONFIRMING'
           WHEN p_payment_status = 'expired' THEN 'EXPIRED'
           WHEN p_payment_status = 'failed' THEN 'FAILED'
           ELSE 'PENDING'
        END,
      updated_at = now()
    WHERE id = v_transaction.id;
    
    RETURN json_build_object('status', 'updated', 'new_status', p_payment_status);
  END IF;

  RETURN json_build_object('status', 'unknown');
EXCEPTION
  WHEN others THEN
    RETURN json_build_object('status', 'error', 'message', SQLERRM);
END;
$$;

-- Add comment documenting the fix
COMMENT ON FUNCTION process_payment_webhook IS 'Processes NOWPayments webhook callbacks atomically. Fixed in migration 003 to use correct table name access_control_logs.';
