# Product Requirements Document (PRD)
## Telegram Subscription Automation Platform

**Version:** 1.0  
**Date:** January 25, 2026  
**Document Owner:** Product Management  
**Classification:** Confidential - For Internal & Investor Use

---

## 1. Executive Summary

This document defines the requirements for a white-label SaaS platform that enables Telegram trading signal channel owners to automate subscriber management, payment processing, and access control through cryptocurrency payments.

The platform operates as a dual-bot architecture: a centralized **Main Bot** for platform administration and client management, and client-owned **Selling Bots** that handle subscriber interactions. The platform is non-custodial, processing payments exclusively through NOWPayments integration with client-provided credentials.

**Key Differentiators:**
- Zero platform custody of funds
- White-label branding for client businesses
- Automated access control for Telegram channels and groups
- Client-level free trial (7 days)
- Fully crypto-based payment infrastructure

**Primary Use Case:** Trading signal providers who monetize Telegram channels through subscription access and require automated payment collection, subscriber onboarding, and access management without holding customer funds.

---

## 2. Product Vision & Goals

### 2.1 Vision Statement

To become the leading non-custodial subscription automation infrastructure for Telegram-based content creators, enabling them to monetize their channels through seamless cryptocurrency payment workflows while maintaining complete financial sovereignty.

### 2.2 Strategic Goals

**Year 1:**
- Onboard 100+ trading signal channel owners
- Process $1M+ in subscription payments (non-custodial flow-through)
- Achieve 95%+ uptime for bot infrastructure
- Maintain sub-5% payment failure rate

**Business Objectives:**
- Enable clients to reduce manual subscription management by 95%
- Reduce client churn through automated renewal workflows
- Support multi-bot clients (agencies, multi-channel operators)
- Establish platform as compliance-friendly (non-custodial architecture)

### 2.3 Success Metrics

- Client activation rate (trial to paid conversion)
- Average revenue per client (ARPC)
- Subscriber payment success rate
- Client retention rate (MRR churn)
- Average subscribers per client
- Platform uptime and latency

---

## 3. Target Users & Personas

### 3.1 Primary User: The Client (Channel Owner)

**Profile:**
- Trading signal provider with 500-50,000+ Telegram subscribers
- Offers premium content (trade signals, analysis, education)
- Currently manages subscriptions manually or through basic bots
- Seeks to reduce operational overhead
- Values financial privacy and non-custodial solutions

**Pain Points:**
- Manual verification of payments
- Subscriber access management at scale
- Payment tracking and renewal reminders
- Lack of automation tools
- Trust issues with custodial platforms

**Goals:**
- Automate 100% of subscription workflows
- Reduce time spent on admin tasks
- Maintain brand control
- Accept crypto payments without KYC overhead
- Scale subscriber base without scaling operational burden

### 3.2 Secondary User: Platform Administrator

**Profile:**
- Platform operator or technical support staff
- Manages platform-level configurations
- Handles client escalations
- Monitors system health and abuse

**Responsibilities:**
- Client onboarding and verification
- Platform-wide policy enforcement
- Technical support
- Fraud and abuse monitoring
- System configuration management

### 3.3 Tertiary User: The Subscriber (End User)

**Profile:**
- Trader or investor seeking premium signals
- Familiar with cryptocurrency
- Values anonymity and speed
- Expects instant access post-payment

**Pain Points:**
- Complex payment flows
- Delayed access after payment
- Unclear subscription status
- Lack of payment transparency

**Goals:**
- Quick subscription purchase
- Instant channel access
- Clear subscription expiration visibility
- Easy renewal process

---

## 4. System Architecture Overview

### 4.1 High-Level Architecture

The platform consists of three primary layers:

**Layer 1: Main Bot (Control Plane)**
- Single Telegram bot instance
- Handles all administrative operations
- Manages client accounts and platform subscriptions
- Creates and configures Selling Bots
- Enforces global policies and limits

**Layer 2: Selling Bots (Subscriber Interface)**
- Multiple bot instances (one or more per client)
- Handle subscriber interactions exclusively
- Display subscription plans
- Generate payment invoices via NOWPayments
- Manage channel/group access
- Report events to backend

**Layer 3: Backend Services**
- Centralized data store (source of truth)
- Payment webhook processor (NOWPayments)
- Access control logic engine
- Subscription state machine
- Client billing processor
- Event logging and analytics

### 4.2 Data Flow Principles

**Subscriber → Selling Bot → Backend → Main Bot (Admin View)**

- Subscribers interact only with Selling Bots
- Selling Bots forward all data to backend
- Backend maintains canonical state
- Main Bot reads from backend for administrative views
- No direct subscriber-to-Main Bot communication

**Payment Flow:**
Selling Bot → NOWPayments → Webhook → Backend → Access Grant → Selling Bot → Channel Access

### 4.3 Bot Separation Rationale

**Why Two Bot Types:**
- Clear separation of concerns (admin vs subscriber)
- White-label branding isolation
- Independent scaling (subscriber bots scale per client)
- Security isolation (admin operations protected)
- Telegram API rate limit distribution

---

## 5. User Journeys & Flow Diagrams

### 5.1 Client Onboarding Journey

**Step 1: Initial Contact**
- Client starts Main Bot
- Receives welcome message with platform overview
- Prompted to create account

**Step 2: Account Creation**
- Provides business information (channel name, contact)
- Accepts terms of service
- Account status: PENDING_VERIFICATION

**Step 3: Verification (Optional Manual Step)**
- Platform admin reviews application
- Approves or rejects
- Client receives notification

**Step 4: First Selling Bot Creation**
- Client navigates: Main Bot → Create Bot
- Provides bot token (from BotFather)
- Provides NOWPayments API key
- Provides crypto wallet address
- Bot is linked and validated
- Trial period begins automatically (7 days)

**Step 5: Configuration**
- Sets up subscription plans
- Configures welcome messages
- Links Telegram channel/group
- Makes bot admin of channel

**Step 6: Go Live**
- Selling Bot is active
- Shares bot link with audience
- First subscribers can join

### 5.2 Subscriber Purchase Journey

**Step 1: Discovery**
- Subscriber finds Selling Bot link (from client's channel/website)
- Starts Selling Bot

**Step 2: Welcome & Plan Selection**
- Receives branded welcome message
- Views available subscription plans (e.g., Monthly, Quarterly, Yearly)
- Selects desired plan

**Step 3: Payment**
- Selling Bot generates NOWPayments invoice
- Subscriber receives payment address and amount
- Subscriber sends crypto payment
- Bot displays "waiting for payment" status

**Step 4: Payment Confirmation**
- NOWPayments webhook hits backend
- Backend validates payment
- Subscription is activated
- Backend instructs Selling Bot to grant access

**Step 5: Access Grant**
- Selling Bot sends channel invite link or approval
- Subscriber joins channel
- Receives confirmation message with expiration date

**Step 6: Renewal Notification**
- Selling Bot sends reminders at 7, 3, 1 day before expiration
- Provides renewal link
- If payment received, subscription extends
- If expired, access is revoked

### 5.3 Client Management Journey

**Daily Operation:**
- Client opens Main Bot
- Views dashboard: active subscribers, revenue, trial status
- Navigates to specific bot to view subscribers

**Subscriber Administration:**
- Main Bot → My Bots → Select Bot → Subscribers
- Views list of all subscribers
- Can view individual subscriber details
- Can manually extend/revoke access (admin override)
- Views payment history per subscriber

**Subscription Management:**
- Main Bot → My Bots → Select Bot → Plans
- Creates new subscription plans
- Edits pricing and duration
- Activates/deactivates plans

**Bot Management:**
- Creates additional Selling Bots (if plan allows)
- Updates bot configurations
- Views bot analytics

### 5.4 Trial to Paid Conversion Journey

**During Trial:**
- Client has full platform access
- Can create Selling Bots (per plan limit)
- Receives reminders at 5, 3, 1 day before trial end
- Main Bot displays trial countdown

**Trial Expiration:**
- Day 7: Trial ends
- All Selling Bots are paused
- Subscribers cannot purchase new subscriptions
- Existing active subscriptions continue until expiration
- Client receives "trial expired" notification

**Conversion:**
- Client selects platform subscription plan
- Pays via crypto (same NOWPayments flow)
- Account status changes to ACTIVE
- Selling Bots are reactivated
- Full access restored

**Non-Conversion:**
- Selling Bots remain paused
- No new subscriber onboarding
- Data retained for 30 days
- After 30 days, account may be archived

---

## 6. Functional Requirements

### 6.1 Main Bot Requirements

#### 6.1.1 Platform Admin Management

**REQ-MB-001:** Platform admins can create, modify, and delete admin accounts through Main Bot super-admin interface.

**REQ-MB-002:** Platform admins can view all clients, their status, trial state, and subscription plans.

**REQ-MB-003:** Platform admins can manually approve or reject client applications.

**REQ-MB-004:** Platform admins can suspend or reactivate client accounts.

**REQ-MB-005:** Platform admins can view platform-wide analytics: total clients, total subscribers, payment volume, active trials.

#### 6.1.2 Client Onboarding

**REQ-MB-010:** New clients can register by starting the Main Bot and providing required business information.

**REQ-MB-011:** Main Bot collects: business name, primary contact, Telegram channel username, email (optional).

**REQ-MB-012:** Main Bot validates that the client does not already have an active account (duplicate prevention).

**REQ-MB-013:** Main Bot displays onboarding status and next steps clearly.

**REQ-MB-014:** Main Bot sends confirmation message upon successful account creation.

#### 6.1.3 Free Trial Lifecycle

**REQ-MB-020:** Trial activates automatically when client links their first Selling Bot.

**REQ-MB-021:** Trial duration is exactly 7 days from activation timestamp.

**REQ-MB-022:** Trial can only be activated once per client (no restarts or duplicates).

**REQ-MB-023:** Main Bot displays trial countdown prominently in dashboard.

**REQ-MB-024:** Main Bot sends trial reminders at 5, 3, and 1 day before expiration.

**REQ-MB-025:** Upon trial expiration, Main Bot pauses all client Selling Bots and displays upgrade prompt.

**REQ-MB-026:** Trial state is stored in backend and enforced across all client operations.

#### 6.1.4 Selling Bot Creation & Lifecycle

**REQ-MB-030:** Clients can create new Selling Bots by providing a bot token from BotFather.

**REQ-MB-031:** Main Bot validates bot token and confirms bot is accessible.

**REQ-MB-032:** Main Bot prevents duplicate bot tokens (one bot token per platform).

**REQ-MB-033:** Clients provide NOWPayments API key and crypto wallet address during bot setup.

**REQ-MB-034:** Main Bot validates NOWPayments credentials before completing bot creation.

**REQ-MB-035:** Clients can create multiple Selling Bots subject to their platform subscription plan limits.

**REQ-MB-036:** Clients can pause, reactivate, or delete Selling Bots.

**REQ-MB-037:** When a Selling Bot is paused, it responds to subscribers with "temporarily unavailable" message.

**REQ-MB-038:** When a Selling Bot is deleted, all associated subscriber data remains in backend but bot stops responding.

#### 6.1.5 Client-to-Platform Subscription Plans

**REQ-MB-040:** Platform offers multiple subscription tiers (e.g., Starter, Professional, Enterprise).

**REQ-MB-041:** Each tier defines: max Selling Bots, max subscribers per bot, feature access, monthly price.

**REQ-MB-042:** Clients can view available plans and current plan details in Main Bot.

**REQ-MB-043:** Clients can upgrade plans at any time; downgrade takes effect at next billing cycle.

**REQ-MB-044:** Main Bot generates NOWPayments invoice for platform subscription payments.

**REQ-MB-045:** Upon successful payment, client subscription is activated or renewed.

**REQ-MB-046:** Main Bot sends renewal reminders 7, 3, 1 day before platform subscription expiration.

#### 6.1.6 Client Billing

**REQ-MB-050:** Main Bot displays current billing status, next billing date, and payment history.

**REQ-MB-051:** Clients can view invoices and payment receipts.

**REQ-MB-052:** Upon platform subscription expiration without payment, all Selling Bots are paused.

**REQ-MB-053:** Clients have a 3-day grace period to renew before Selling Bots are paused.

**REQ-MB-054:** Main Bot provides payment link for renewals.

#### 6.1.7 Subscriber Management (Administrative)

**REQ-MB-060:** Clients can view list of all subscribers across all their Selling Bots.

**REQ-MB-061:** For each Selling Bot, clients can view subscriber count, active subscriptions, expired subscriptions.

**REQ-MB-062:** Clients can view individual subscriber details: Telegram username, subscription status, start date, expiration date, payment history.

**REQ-MB-063:** Clients can manually extend subscriber access (admin override).

**REQ-MB-064:** Clients can manually revoke subscriber access (ban/block).

**REQ-MB-065:** All administrative actions are logged with timestamp and admin user.

**REQ-MB-066:** Clients can export subscriber lists (CSV format).

#### 6.1.8 Enforcing Global Rules and Limits

**REQ-MB-070:** Main Bot enforces platform subscription tier limits (max bots, max subscribers).

**REQ-MB-071:** Main Bot prevents clients from exceeding their plan's Selling Bot limit.

**REQ-MB-072:** Main Bot displays warning when client approaches subscriber limits.

**REQ-MB-073:** Main Bot enforces platform-wide terms of service (e.g., prohibited content, fraud prevention).

**REQ-MB-074:** Platform admins can set global rate limits (e.g., max new subscribers per hour per bot).

#### 6.1.9 White-Label Enforcement

**REQ-MB-080:** Main Bot ensures all Selling Bots display mandatory platform footer branding.

**REQ-MB-081:** Platform footer text is defined at platform level and cannot be modified by clients.

**REQ-MB-082:** Main Bot validates Selling Bot message templates to ensure footer is present.

**REQ-MB-083:** Clients can customize Selling Bot messages above the footer line.

### 6.2 Selling Bot Requirements

#### 6.2.1 Subscriber Onboarding

**REQ-SB-001:** When a subscriber starts the Selling Bot, they receive a branded welcome message.

**REQ-SB-002:** Welcome message includes: client branding, bot purpose, available subscription plans, mandatory platform footer.

**REQ-SB-003:** Selling Bot provides menu options: View Plans, Check Subscription, Support, Help.

**REQ-SB-004:** Selling Bot notifies the backend when a new subscriber starts the bot.

**REQ-SB-005:** Backend sends notification to client (via Main Bot) when a new subscriber starts their Selling Bot.

#### 6.2.2 Displaying Subscription Plans

**REQ-SB-010:** Selling Bot displays all active subscription plans configured by the client.

**REQ-SB-011:** Each plan shows: duration (e.g., 30 days), price (in crypto), currency (e.g., USDT), description.

**REQ-SB-012:** Plans are displayed with clear call-to-action buttons (e.g., "Subscribe - Monthly - $50 USDT").

**REQ-SB-013:** Subscribers can select a plan and proceed to payment.

#### 6.2.3 Creating Crypto Invoices (NOWPayments)

**REQ-SB-020:** Upon plan selection, Selling Bot calls NOWPayments API to create invoice.

**REQ-SB-021:** Invoice creation uses client-provided API key and wallet address.

**REQ-SB-022:** Selling Bot displays payment details: amount, currency, payment address, QR code (if supported), expiration time.

**REQ-SB-023:** Invoice is valid for 30 minutes; after expiration, subscriber must request a new invoice.

**REQ-SB-024:** Selling Bot displays "waiting for payment" status with countdown timer.

**REQ-SB-025:** Selling Bot provides "Check Payment Status" button for manual refresh.

#### 6.2.4 Sending Payment Status Events

**REQ-SB-030:** NOWPayments webhook sends payment status updates to backend.

**REQ-SB-031:** Backend processes webhook and updates subscription state.

**REQ-SB-032:** Backend instructs Selling Bot to notify subscriber of payment status.

**REQ-SB-033:** Selling Bot sends success message upon confirmed payment: "Payment received! Access granted."

**REQ-SB-034:** Selling Bot sends failure message if payment fails or expires: "Payment not received. Please try again."

**REQ-SB-035:** All payment events are logged with timestamps and transaction IDs.

#### 6.2.5 Managing Subscriber Access to Channels/Groups

**REQ-SB-040:** Upon successful payment, Selling Bot grants subscriber access to linked Telegram channel/group.

**REQ-SB-041:** Access is granted via invite link (for public channels) or approval (for private groups with join requests).

**REQ-SB-042:** Selling Bot must be an admin of the target channel/group with permissions to invite users or approve join requests.

**REQ-SB-043:** Selling Bot sends invite link or approval notification to subscriber.

**REQ-SB-044:** Upon subscription expiration, Selling Bot revokes access by removing subscriber from channel/group.

**REQ-SB-045:** Selling Bot sends expiration warning at 7, 3, 1 day before expiration.

**REQ-SB-046:** If subscriber renews before expiration, access continues uninterrupted.

#### 6.2.6 Handling Request Join Approvals

**REQ-SB-050:** For channels/groups using Telegram's "request to join" feature, Selling Bot monitors join requests.

**REQ-SB-051:** When a subscriber with active subscription requests to join, Selling Bot auto-approves.

**REQ-SB-052:** When a non-subscriber or expired subscriber requests to join, Selling Bot denies and prompts them to subscribe.

**REQ-SB-053:** Selling Bot logs all join request decisions.

#### 6.2.7 Notifying Client When Subscriber Starts Bot

**REQ-SB-060:** When a new subscriber starts the Selling Bot, backend logs this event.

**REQ-SB-061:** Backend sends notification to client via Main Bot: "New subscriber started [Bot Name]".

**REQ-SB-062:** Notification includes subscriber's Telegram username and timestamp.

**REQ-SB-063:** Clients can disable these notifications in Main Bot settings.

#### 6.2.8 Displaying Mandatory Platform Footer Branding

**REQ-SB-070:** All subscriber-facing messages from Selling Bot include mandatory platform footer.

**REQ-SB-071:** Footer format: "Powered by [Platform Name]" or similar branding text.

**REQ-SB-072:** Footer is appended automatically by backend/Selling Bot logic and cannot be removed.

**REQ-SB-073:** Footer appears at the end of all messages: welcome, payment instructions, confirmations, reminders.

---

## 7. Non-Functional Requirements

### 7.1 Performance

**REQ-NFR-001:** Main Bot responds to client commands within 2 seconds under normal load.

**REQ-NFR-002:** Selling Bots respond to subscriber interactions within 2 seconds under normal load.

**REQ-NFR-003:** Payment webhooks are processed within 5 seconds of receipt.

**REQ-NFR-004:** Channel access is granted within 10 seconds of payment confirmation.

**REQ-NFR-005:** System supports 10,000+ concurrent subscribers across all Selling Bots.

**REQ-NFR-006:** System supports 1,000+ active clients with 100+ Selling Bots.

### 7.2 Scalability

**REQ-NFR-010:** Architecture scales horizontally to support client growth.

**REQ-NFR-011:** Backend services are stateless and can be load-balanced.

**REQ-NFR-012:** Database supports read replicas for analytics and reporting.

**REQ-NFR-013:** Selling Bot instances scale independently per client demand.

### 7.3 Reliability & Availability

**REQ-NFR-020:** Platform achieves 99.5% uptime (excluding scheduled maintenance).

**REQ-NFR-021:** Scheduled maintenance windows are announced 48 hours in advance.

**REQ-NFR-022:** Critical functions (payment processing, access control) have redundancy and failover.

**REQ-NFR-023:** Webhook processing has retry logic with exponential backoff.

**REQ-NFR-024:** Failed webhooks are queued and retried up to 5 times over 24 hours.

### 7.4 Security

**REQ-NFR-030:** All API keys (NOWPayments, Telegram bot tokens) are encrypted at rest.

**REQ-NFR-031:** Client wallet addresses are validated but never used for platform operations.

**REQ-NFR-032:** Platform does not store private keys or seed phrases.

**REQ-NFR-033:** All backend API endpoints require authentication and authorization.

**REQ-NFR-034:** Payment webhooks are validated using NOWPayments signature verification.

**REQ-NFR-035:** Rate limiting is enforced to prevent abuse (e.g., 100 requests per minute per bot).

**REQ-NFR-036:** Subscriber personal data (Telegram ID, username) is stored securely and accessed only by authorized clients.

### 7.5 Compliance & Data Privacy

**REQ-NFR-040:** Platform complies with GDPR for EU-based clients and subscribers (data export, deletion requests).

**REQ-NFR-041:** Clients can delete their account and all associated data.

**REQ-NFR-042:** Subscribers can request data deletion (processed via client or platform admin).

**REQ-NFR-043:** Platform logs are retained for 90 days for audit purposes.

**REQ-NFR-044:** Payment transaction logs are retained indefinitely for compliance.

### 7.6 Usability

**REQ-NFR-050:** Main Bot UI uses clear, concise language and intuitive navigation.

**REQ-NFR-051:** All error messages provide actionable guidance.

**REQ-NFR-052:** Selling Bot messages are customizable while maintaining clarity.

**REQ-NFR-053:** Platform provides help documentation accessible via Main Bot.

### 7.7 Monitoring & Observability

**REQ-NFR-060:** System logs all critical events: payments, access grants/revocations, errors.

**REQ-NFR-061:** Platform admins have access to real-time dashboards (client activity, payment volume, error rates).

**REQ-NFR-062:** Automated alerts trigger for: webhook failures, bot downtime, high error rates.

**REQ-NFR-063:** All logs include correlation IDs for tracing transactions end-to-end.

---

## 8. Data Models (High-Level)

### 8.1 Client Entity

**Attributes:**
- client_id (unique identifier)
- telegram_user_id (Main Bot user ID)
- business_name
- contact_email
- registration_date
- status (PENDING, ACTIVE, TRIAL, EXPIRED, SUSPENDED)
- trial_start_date
- trial_end_date
- trial_activated (boolean)
- platform_subscription_plan_id
- platform_subscription_start_date
- platform_subscription_end_date
- created_at
- updated_at

**Relationships:**
- One client has many Selling Bots
- One client has one platform subscription plan
- One client has many subscribers (indirect, via Selling Bots)

### 8.2 Selling Bot Entity

**Attributes:**
- bot_id (unique identifier)
- client_id (foreign key)
- bot_token (encrypted)
- bot_username
- bot_name (display name)
- nowpayments_api_key (encrypted)
- crypto_wallet_address
- linked_channel_id (Telegram channel/group ID)
- linked_channel_username
- status (ACTIVE, PAUSED, DELETED)
- created_at
- updated_at

**Relationships:**
- One Selling Bot belongs to one client
- One Selling Bot has many subscribers
- One Selling Bot has many subscription plans

### 8.3 Subscriber Entity

**Attributes:**
- subscriber_id (unique identifier)
- telegram_user_id
- telegram_username
- first_name
- last_name
- bot_id (foreign key)
- subscription_status (ACTIVE, EXPIRED, PENDING_PAYMENT, REVOKED)
- subscription_start_date
- subscription_end_date
- subscription_plan_id
- created_at
- updated_at

**Relationships:**
- One subscriber belongs to one Selling Bot
- One subscriber has many payment transactions
- One subscriber has one active subscription plan (at a time)

### 8.4 Subscription Plan Entity

**Attributes:**
- plan_id (unique identifier)
- bot_id (foreign key) [for client plans] OR null [for platform plans]
- plan_type (PLATFORM or CLIENT)
- name (e.g., "Monthly Premium")
- description
- duration_days
- price_amount
- price_currency (e.g., USDT, BTC)
- status (ACTIVE, INACTIVE)
- created_at
- updated_at

**Relationships:**
- Platform plans are global, client plans are bot-specific
- One plan has many subscribers (historical)

### 8.5 Payment Transaction Entity

**Attributes:**
- transaction_id (unique identifier)
- subscriber_id (foreign key) [for subscriber payments] OR client_id [for platform payments]
- payment_type (SUBSCRIBER_SUBSCRIPTION or PLATFORM_SUBSCRIPTION)
- nowpayments_invoice_id
- amount
- currency
- payment_status (PENDING, CONFIRMED, FAILED, EXPIRED)
- payment_address
- transaction_hash (blockchain)
- created_at
- confirmed_at
- updated_at

**Relationships:**
- One transaction belongs to one subscriber or client
- One transaction is associated with one subscription plan

### 8.6 Access Control Log Entity

**Attributes:**
- log_id (unique identifier)
- subscriber_id (foreign key)
- bot_id (foreign key)
- action (GRANT, REVOKE, MANUAL_EXTEND, MANUAL_REVOKE)
- performed_by (SYSTEM, CLIENT, ADMIN)
- timestamp
- reason (optional)

**Relationships:**
- Logs all access control decisions for audit trail

### 8.7 Platform Admin Entity

**Attributes:**
- admin_id (unique identifier)
- telegram_user_id
- username
- role (SUPER_ADMIN, SUPPORT)
- created_at
- updated_at

**Relationships:**
- Admins can perform actions on all clients and bots

---

## 9. Payment Flow & Webhooks

### 9.1 Subscriber Payment Flow (Detailed)

**Step 1: Plan Selection**
- Subscriber interacts with Selling Bot
- Selects subscription plan (e.g., "Monthly - $50 USDT")
- Selling Bot sends request to backend with: subscriber_id, bot_id, plan_id

**Step 2: Invoice Generation**
- Backend retrieves client's NOWPayments API key and wallet address
- Backend calls NOWPayments API: createInvoice
- Parameters: price_amount, price_currency, pay_currency, ipn_callback_url, order_id
- NOWPayments returns: invoice_id, pay_address, pay_amount, pay_currency, expiration_time

**Step 3: Display Payment Instructions**
- Backend sends payment details to Selling Bot
- Selling Bot displays to subscriber: payment address, amount, QR code (optional), expiration countdown
- Backend creates transaction record with status PENDING

**Step 4: Subscriber Sends Payment**
- Subscriber sends crypto to provided address
- NOWPayments monitors blockchain for transaction

**Step 5: Webhook Notification (Partial Confirmation)**
- NOWPayments sends webhook to backend: status = "partially_paid" or "confirming"
- Backend updates transaction status
- Selling Bot notifies subscriber: "Payment detected, waiting for confirmations"

**Step 6: Webhook Notification (Full Confirmation)**
- NOWPayments sends webhook: status = "finished"
- Backend validates webhook signature
- Backend updates transaction status to CONFIRMED
- Backend updates subscriber subscription_status to ACTIVE
- Backend calculates subscription_end_date (current time + plan duration)

**Step 7: Access Grant**
- Backend sends instruction to Selling Bot: grant access to subscriber
- Selling Bot generates invite link or approves join request
- Selling Bot sends confirmation message to subscriber with expiration date
- Backend logs access grant in Access Control Log

**Step 8: Payment Failure Scenarios**
- If payment expires (30 min): NOWPayments sends status "expired", backend updates transaction to EXPIRED
- If payment fails: backend updates transaction to FAILED
- Selling Bot notifies subscriber to try again

### 9.2 Client Platform Subscription Payment Flow

**Same flow as above, but:**
- Initiated via Main Bot, not Selling Bot
- Payment tied to client_id, not subscriber_id
- Upon confirmation, client's platform_subscription_status updates to ACTIVE
- All client Selling Bots are reactivated if previously paused

### 9.3 Webhook Security & Validation

**REQ-WEBHOOK-001:** All NOWPayments webhooks include signature in header (IPN-Signature).

**REQ-WEBHOOK-002:** Backend validates signature using HMAC-SHA512 with IPN secret.

**REQ-WEBHOOK-003:** Invalid signatures are rejected with HTTP 403.

**REQ-WEBHOOK-004:** Duplicate webhooks (same invoice_id and status) are idempotent (no double-processing).

**REQ-WEBHOOK-005:** Backend responds with HTTP 200 immediately, processes webhook asynchronously.

### 9.4 Webhook Retry Logic

**REQ-WEBHOOK-010:** If backend fails to process webhook, NOWPayments retries automatically (their retry policy).

**REQ-WEBHOOK-011:** Backend implements internal retry queue for failed processing (e.g., database unavailable).

**REQ-WEBHOOK-012:** Retries occur at: 1 min, 5 min, 15 min, 1 hour, 6 hours after initial failure.

**REQ-WEBHOOK-013:** After 5 failed retries, webhook is flagged for manual review.

---

## 10. Access Control Logic

### 10.1 Access Grant Conditions

**Condition 1: Active Subscription**
- subscriber.subscription_status = ACTIVE
- subscriber.subscription_end_date > current_time

**Condition 2: Manual Override**
- Admin (client or platform admin) manually extends access
- Recorded in Access Control Log with reason

**If conditions met:** Subscriber is granted access to channel/group.

### 10.2 Access Revocation Triggers

**Trigger 1: Subscription Expiration**
- subscriber.subscription_end_date <= current_time
- Automated job runs every hour to check for expirations
- Access is revoked, subscriber is removed from channel/group

**Trigger 2: Payment Failure/Refund**
- If NOWPayments sends refund webhook, subscription is terminated immediately
- Access revoked

**Trigger 3: Manual Revocation**
- Client or platform admin manually revokes access (ban)
- subscriber.subscription_status = REVOKED
- Access revoked immediately

**Trigger 4: Client Platform Subscription Expired**
- If client's platform subscription expires and grace period ends
- All Selling Bots are paused
- No new subscriber access grants, but existing active subscriptions continue until their individual expiration

### 10.3 Channel/Group Admin Requirements

**REQ-ACCESS-001:** Selling Bot must be added as admin to target channel/group.

**REQ-ACCESS-002:** Selling Bot requires permissions: invite users