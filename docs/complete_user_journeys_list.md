# Complete User Journey List
## Telegram Subscription Automation Platform

**Version:** 1.0  
**Date:** January 25, 2026  
**Document Type:** User Journey Index & Reference

---

## Journey Categories

1. [Platform Admin → Main Bot](#1-platform-admin--main-bot)
2. [Client → Main Bot](#2-client--main-bot)
3. [Client → Selling Bot](#3-client--selling-bot)
4. [Subscriber → Selling Bot](#4-subscriber--selling-bot)
5. [System-Initiated Journeys](#5-system-initiated-journeys)

---

## 1. PLATFORM ADMIN → MAIN BOT

### 1.1 Platform Setup & Configuration

**Journey 1.1.1: Initial Platform Setup**
- **Trigger:** Platform deployment completed
- **Steps:**
  - Start Main Bot
  - Create super admin account
  - Configure platform settings (name, branding, trial duration)
  - Create platform subscription plans
  - Configure global rate limits
  - Review admin dashboard

**Journey 1.1.2: Platform Settings Management**
- **Trigger:** Admin needs to update platform configuration
- **Steps:**
  - Navigate to Settings
  - Update platform branding footer
  - Modify trial duration
  - Configure default limits
  - Update terms of service link

---

### 1.2 Client Management

**Journey 1.2.1: Client Application Review**
- **Trigger:** New client registration (status = PENDING)
- **Steps:**
  - Receive notification of new application
  - Review client details (business name, channel, Telegram profile)
  - Check for fraud indicators
  - Approve or reject application
  - Send notification to client

**Journey 1.2.2: Client Account Suspension**
- **Trigger:** Fraud detected or terms violation
- **Steps:**
  - Open client profile
  - Review violation details
  - Enter suspension reason
  - Confirm suspension
  - All client bots paused
  - Client notified

**Journey 1.2.3: Client Account Reactivation**
- **Trigger:** Suspended client appeals/resolves issue
- **Steps:**
  - Review suspension case
  - Verify issue resolution
  - Reactivate account
  - Restore bot access
  - Log reactivation

**Journey 1.2.4: View All Clients List**
- **Trigger:** Admin wants to monitor clients
- **Steps:**
  - Navigate to "All Clients"
  - Apply filters (status, plan, trial expiring)
  - View paginated list
  - Select client for details

**Journey 1.2.5: Manual Trial Extension**
- **Trigger:** Special case requires trial extension
- **Steps:**
  - Select client account
  - Choose "Extend Trial"
  - Enter extension duration
  - Enter reason
  - Confirm extension

---

### 1.3 Platform Monitoring

**Journey 1.3.1: Daily Platform Health Check**
- **Trigger:** Admin routine or scheduled reminder
- **Steps:**
  - Open Main Bot dashboard
  - Review metrics (clients, subscribers, revenue)
  - Check system health indicators
  - Review error rates
  - Check webhook failure queue

**Journey 1.3.2: Investigate System Anomaly**
- **Trigger:** Alert notification or unusual metric
- **Steps:**
  - Receive alert (e.g., high error rate)
  - Navigate to affected service
  - View error logs
  - Identify root cause
  - Take corrective action
  - Document resolution

**Journey 1.3.3: Monitor Payment Processing**
- **Trigger:** Daily revenue review
- **Steps:**
  - View payment dashboard
  - Check 24h/7d/30d volumes
  - Review failed payments
  - Check webhook delivery status
  - Investigate anomalies

---

### 1.4 Fraud & Abuse Prevention

**Journey 1.4.1: Fraud Investigation**
- **Trigger:** Automated fraud alert or manual report
- **Steps:**
  - Receive fraud alert
  - Open investigation dashboard
  - Review client activity timeline
  - Analyze subscriber patterns
  - Check payment patterns
  - Review blockchain transactions
  - Make decision (suspend/flag/clear)
  - Document findings

**Journey 1.4.2: Bot Farm Detection**
- **Trigger:** Unusual subscriber growth pattern
- **Steps:**
  - Identify suspicious client
  - Analyze subscriber data (usernames, IDs, timing)
  - Check Telegram account ages
  - Review payment sources
  - Suspend if confirmed
  - Ban fake subscribers

**Journey 1.4.3: Payment Dispute Resolution**
- **Trigger:** Escalated support ticket
- **Steps:**
  - Review ticket details
  - Verify payment in NOWPayments
  - Check blockchain explorer
  - Audit system logs
  - Make resolution decision
  - Communicate to client and subscriber
  - Close ticket

---

### 1.5 Support & Troubleshooting

**Journey 1.5.1: Client Technical Support**
- **Trigger:** Client reports technical issue
- **Steps:**
  - Receive support request
  - Review issue description
  - Check bot status and logs
  - Diagnose problem
  - Provide solution steps
  - Follow up on resolution

**Journey 1.5.2: Manual Payment Processing**
- **Trigger:** Webhook failure requiring manual intervention
- **Steps:**
  - Identify failed webhook
  - Verify payment in NOWPayments dashboard
  - Confirm blockchain transaction
  - Manually update subscriber status
  - Grant channel access
  - Log manual intervention

**Journey 1.5.3: Bot Permission Fix Assistance**
- **Trigger:** Client's bot losing admin permissions
- **Steps:**
  - Detect permission error
  - Notify client with instructions
  - Verify client follows steps
  - Retest bot permissions
  - Reactivate bot once fixed

---

### 1.6 Analytics & Reporting

**Journey 1.6.1: Generate Platform Reports**
- **Trigger:** Monthly/quarterly reporting
- **Steps:**
  - Navigate to Reports section
  - Select report type (revenue, growth, retention)
  - Choose date range
  - Generate report
  - Export data (CSV/PDF)

**Journey 1.6.2: Client Performance Review**
- **Trigger:** Identify top/struggling clients
- **Steps:**
  - View client leaderboard
  - Sort by metrics (subscribers, revenue, retention)
  - Analyze successful patterns
  - Identify at-risk clients
  - Plan interventions

---

## 2. CLIENT → MAIN BOT

### 2.1 Account Setup & Onboarding

**Journey 2.1.1: Registration & Account Creation**
- **Trigger:** New client discovers platform
- **Steps:**
  - Start Main Bot
  - Receive welcome message
  - Click [Register Now]
  - Enter business name
  - Enter channel username
  - Enter email (optional)
  - Accept Terms of Service
  - Submit application
  - Wait for approval (if manual approval enabled)

**Journey 2.1.2: First Bot Setup**
- **Trigger:** Account approved, ready to create bot
- **Steps:**
  - Receive approval notification
  - Follow BotFather instructions
  - Create bot via @BotFather
  - Copy bot token
  - Paste token in Main Bot
  - Token validated
  - Bot registered

**Journey 2.1.3: NOWPayments Configuration**
- **Trigger:** Bot created, needs payment setup
- **Steps:**
  - Receive prompt for NOWPayments credentials
  - Go to NOWPayments dashboard
  - Generate API key
  - Copy API key
  - Paste in Main Bot
  - API key validated
  - Enter crypto wallet address
  - Wallet address validated
  - Payment setup confirmed

**Journey 2.1.4: Channel Linking**
- **Trigger:** Payment setup complete
- **Steps:**
  - Receive instructions to add bot as admin
  - Open Telegram channel settings
  - Add bot as administrator
  - Grant permissions (invite users, delete messages)
  - Return to Main Bot
  - Click [Done]
  - Bot verifies admin status
  - Channel linked successfully
  - **TRIAL STARTS AUTOMATICALLY**

**Journey 2.1.5: Create First Subscription Plan**
- **Trigger:** Channel linked, bot active
- **Steps:**
  - Prompted to create plan
  - Click [Create Plan]
  - Enter plan name (e.g., "Monthly Premium")
  - Enter price amount (e.g., 50)
  - Select currency (USDT/BTC/ETH)
  - Enter duration in days (e.g., 30)
  - Enter description (optional)
  - Save plan
  - Plan activated
  - Share bot link with audience

---

### 2.2 Daily Operations & Management

**Journey 2.2.1: View Dashboard**
- **Trigger:** Client opens Main Bot
- **Steps:**
  - Main Bot displays dashboard
  - View trial/subscription status
  - View today's stats (new subscribers, revenue)
  - View all bots overview
  - Access quick actions

**Journey 2.2.2: Navigate to Bot Details**
- **Trigger:** Client wants to manage specific bot
- **Steps:**
  - Click "My Bots"
  - Select bot from list
  - View bot stats (active subs, expired, revenue)
  - Access bot management menu

**Journey 2.2.3: View Subscribers List**
- **Trigger:** Client wants to see all subscribers
- **Steps:**
  - Navigate to bot → Subscribers
  - View paginated list
  - Apply filters (Active/Expired/Expiring Soon)
  - Search by username
  - Navigate pages

**Journey 2.2.4: View Individual Subscriber Profile**
- **Trigger:** Client clicks on specific subscriber
- **Steps:**
  - Select subscriber from list
  - View profile (username, status, dates)
  - View subscription details
  - View payment history
  - Access action buttons

**Journey 2.2.5: Manually Extend Subscription**
- **Trigger:** Client rewards loyal subscriber
- **Steps:**
  - Open subscriber profile
  - Click [Extend Subscription]
  - Select duration (7/30/90/Custom days)
  - Enter reason (optional)
  - Confirm extension
  - Subscriber notified
  - Extension confirmed

**Journey 2.2.6: Manually Revoke Access (Ban)**
- **Trigger:** Subscriber violates rules
- **Steps:**
  - Open subscriber profile
  - Click [Revoke Access]
  - Read warning
  - Enter revocation reason
  - Confirm revocation
  - Subscriber removed from channel
  - Subscriber notified
  - Action logged

**Journey 2.2.7: Export Subscribers List**
- **Trigger:** Client needs data for external use
- **Steps:**
  - Navigate to bot → Subscribers
  - Click [Export]
  - Select format (CSV)
  - Generate file
  - Download link provided
  - Download CSV

**Journey 2.2.8: Send Mass Message to Subscribers**
- **Trigger:** Client has announcement
- **Steps:**
  - Navigate to bot → Subscribers
  - Click [Send Message]
  - Select recipients (All/Active/Expiring Soon)
  - Compose message
  - Preview message
  - Confirm send
  - Messages sent in batches
  - Delivery report provided

---

### 2.3 Bot Management

**Journey 2.3.1: Create Additional Selling Bot**
- **Trigger:** Client has multiple channels
- **Steps:**
  - Check plan limits
  - Navigate to "My Bots"
  - Click [Create New Bot]
  - Follow bot creation flow (same as 2.1.2-2.1.5)
  - Bot activated
  - Added to bot list

**Journey 2.3.2: Pause Selling Bot**
- **Trigger:** Client needs temporary pause
- **Steps:**
  - Select bot
  - Click [Pause Bot]
  - Confirm action
  - Bot status = PAUSED
  - Subscribers see "temporarily unavailable" message

**Journey 2.3.3: Reactivate Paused Bot**
- **Trigger:** Ready to resume operations
- **Steps:**
  - Select paused bot
  - Click [Reactivate]
  - Confirm action
  - Bot status = ACTIVE
  - Normal operations resume

**Journey 2.3.4: Update Bot Settings**
- **Trigger:** Need to change configuration
- **Steps:**
  - Select bot
  - Click [Settings]
  - Update welcome message
  - Update NOWPayments credentials (if needed)
  - Update channel link
  - Save changes

**Journey 2.3.5: Delete Selling Bot**
- **Trigger:** Bot no longer needed
- **Steps:**
  - Select bot
  - Click [Delete Bot]
  - Read warning about data retention
  - Confirm deletion
  - Bot deleted (data archived)

---

### 2.4 Subscription Plan Management

**Journey 2.4.1: Create New Subscription Plan**
- **Trigger:** Add pricing tier
- **Steps:**
  - Navigate to bot → Plans
  - Click [Create Plan]
  - Enter plan details
  - Save plan
  - Plan available to subscribers

**Journey 2.4.2: Edit Existing Plan**
- **Trigger:** Price or duration change
- **Steps:**
  - Navigate to bot → Plans
  - Select plan
  - Click [Edit]
  - Update fields
  - Save changes
  - Note: Doesn't affect existing subscribers

**Journey 2.4.3: Deactivate Plan**
- **Trigger:** Stop offering specific plan
- **Steps:**
  - Select plan
  - Click [Deactivate]
  - Confirm
  - Plan hidden from new subscribers
  - Existing subscribers unaffected

**Journey 2.4.4: Copy Plans from Another Bot**
- **Trigger:** Creating new bot with same pricing
- **Steps:**
  - During bot setup or in Plans section
  - Click [Copy from Existing Bot]
  - Select source bot
  - Select plans to copy
  - Plans duplicated

---

### 2.5 Trial & Platform Subscription

**Journey 2.5.1: Trial Period Monitoring**
- **Trigger:** During 7-day trial
- **Steps:**
  - Dashboard shows trial countdown
  - Receive reminders at Day -5, -3, -1
  - Review platform subscription plans
  - Decide whether to upgrade

**Journey 2.5.2: Upgrade from Trial to Paid**
- **Trigger:** Trial expiring or client ready to upgrade
- **Steps:**
  - Click [Upgrade Now]
  - View platform plans (Starter/Professional/Enterprise)
  - Select plan
  - Generate NOWPayments invoice
  - View payment instructions
  - Send crypto payment
  - Payment confirmed
  - Account status = ACTIVE
  - All bots reactivated

**Journey 2.5.3: Trial Expiration Without Payment**
- **Trigger:** Day 7 trial end, no payment
- **Steps:**
  - Receive expiration notification
  - All bots paused
  - Existing subscriptions continue
  - No new subscriber onboarding
  - Prompted to upgrade
  - 30-day data retention period

**Journey 2.5.4: Platform Subscription Renewal**
- **Trigger:** Monthly subscription expiring
- **Steps:**
  - Receive renewal reminders (Day -7, -3, -1)
  - Click [Renew]
  - Generate invoice for same plan
  - Pay
  - Subscription extended
  - Service continues

**Journey 2.5.5: Upgrade Platform Plan**
- **Trigger:** Need more bots or subscribers
- **Steps:**
  - Navigate to Subscription
  - Click [Upgrade Plan]
  - Select higher tier
  - Pay difference (prorated)
  - New limits applied immediately

**Journey 2.5.6: Downgrade Platform Plan**
- **Trigger:** Reduce costs
- **Steps:**
  - Navigate to Subscription
  - Click [Change Plan]
  - Select lower tier
  - Confirm downgrade takes effect next billing cycle
  - If over new limits, prompted to remove bots

---

### 2.6 Analytics & Insights

**Journey 2.6.1: View Bot Analytics**
- **Trigger:** Track performance
- **Steps:**
  - Select bot
  - Click [Analytics]
  - View metrics:
    - Subscriber growth chart
    - Revenue trends
    - Conversion rate
    - Retention rate
    - Churn analysis

**Journey 2.6.2: Export Revenue Report**
- **Trigger:** Accounting/tax purposes
- **Steps:**
  - Navigate to bot → Analytics
  - Click [Export Report]
  - Select date range
  - Choose format (CSV/PDF)
  - Generate report
  - Download

---

### 2.7 Support & Help

**Journey 2.7.1: Submit Support Ticket**
- **Trigger:** Technical issue or question
- **Steps:**
  - Click [Support] or [Help]
  - Select issue type
  - Describe problem
  - Attach screenshots (if applicable)
  - Submit ticket
  - Receive ticket ID
  - Wait for response

**Journey 2.7.2: Check Bot Status**
- **Trigger:** Bot not working
- **Steps:**
  - Navigate to bot details
  - View status indicator
  - If error: view error message
  - Click [Diagnose Issue]
  - Follow suggested fixes
  - Contact support if unresolved

**Journey 2.7.3: Access Help Documentation**
- **Trigger:** Need guidance
- **Steps:**
  - Click [Help]
  - Browse articles
  - Search topics
  - View tutorials
  - Follow step-by-step guides

---

### 2.8 Account Management

**Journey 2.8.1: Update Account Information**
- **Trigger:** Business details change
- **Steps:**
  - Navigate to Settings → Account
  - Update business name
  - Update email
  - Update channel username
  - Save changes

**Journey 2.8.2: Request Data Export (GDPR)**
- **Trigger:** Compliance or personal need
- **Steps:**
  - Navigate to Settings → Privacy
  - Click [Export My Data]
  - Confirm request
  - Wait 24-48 hours
  - Receive download link
  - Download ZIP file

**Journey 2.8.3: Delete Account**
- **Trigger:** Closing business
- **Steps:**
  - Navigate to Settings → Privacy
  - Click [Delete Account]
  - Read consequences
  - Type "DELETE" to confirm
  - All bots paused
  - Subscribers notified
  - Refunds processed
  - Account marked for deletion
  - 30-day recovery period
  - Permanent deletion after 30 days

---

## 3. CLIENT → SELLING BOT

**Note:** Clients rarely interact directly with Selling Bots, but these scenarios exist:

### 3.1 Testing & Verification

**Journey 3.1.1: Test Bot as Subscriber**
- **Trigger:** Verify bot works before launch
- **Steps:**
  - Start own Selling Bot
  - Go through subscriber flow
  - Select plan
  - Make test payment
  - Verify access granted
  - Test renewal flow
  - Test expiration

**Journey 3.1.2: Preview Subscriber Experience**
- **Trigger:** Check messaging and UX
- **Steps:**
  - Start bot from subscriber perspective
  - Review welcome message
  - Check plan display
  - Verify branding
  - Verify footer branding
  - Test commands (/help, /status, /plans)

---

## 4. SUBSCRIBER → SELLING BOT

### 4.1 Onboarding & First Purchase

**Journey 4.1.1: Discover & Start Bot**
- **Trigger:** Find bot link on channel/website
- **Steps:**
  - Click bot link (t.me/botusername)
  - Press /start
  - Receive welcome message with branding
  - View menu options

**Journey 4.1.2: View Available Plans**
- **Trigger:** Want to subscribe
- **Steps:**
  - Click [View Plans] or send /plans
  - See all available subscription options
  - Review pricing and duration
  - Compare plans

**Journey 4.1.3: Select Plan & Generate Invoice**
- **Trigger:** Decided on plan
- **Steps:**
  - Click plan button (e.g., "Monthly - $50 USDT")
  - Bot generates NOWPayments invoice
  - Receive payment instructions
  - View payment address
  - View amount to send
  - View QR code
  - Note 30-minute expiration

**Journey 4.1.4: Make Payment**
- **Trigger:** Ready to pay
- **Steps:**
  - Open crypto wallet
  - Send exact amount to provided address
  - Wait for blockchain confirmation
  - Bot shows "Payment detected, confirming..."
  - Payment confirmed
  - Receive success message

**Journey 4.1.5: Receive Channel Access**
- **Trigger:** Payment confirmed
- **Steps:**
  - Receive confirmation message
  - Receive channel invite link
  - Click invite link
  - Join channel
  - Access granted
  - See subscription expiration date

**Journey 4.1.6: Payment Failure Scenarios**
- **Trigger:** Payment issue
- **Scenarios:**
  - **Invoice Expired:** Receive "Payment window expired" → [Create New Invoice]
  - **Wrong Amount:** Receive "Amount mismatch" → [Contact Support]
  - **Partial Payment:** Receive "Send remaining 5 USDT" → [New Invoice]
  - **Payment Stuck:** Click [Check Status] → Shows confirmation progress

---

### 4.2 Active Subscription Management

**Journey 4.2.1: Check Subscription Status**
- **Trigger:** Want to know expiration date
- **Steps:**
  - Send /status command
  - Bot displays:
    - Current plan
    - Expiration date
    - Days remaining
    - Option to renew early

**Journey 4.2.2: Access Channel (Ongoing)**
- **Trigger:** Daily usage
- **Steps:**
  - Open Telegram
  - Access subscribed channel
  - View content
  - Participate if allowed

**Journey 4.2.3: Request Join (Private Channels)**
- **Trigger:** Lost access or new device
- **Steps:**
  - Find channel
  - Click "Request to Join"
  - Bot checks subscription status
  - Auto-approved if active
  - Declined if expired with renewal link

---

### 4.3 Renewal & Extension

**Journey 4.3.1: Receive Renewal Reminders**
- **Trigger:** Subscription approaching expiration
- **Steps:**
  - Day -7: Receive first reminder
  - Day -3: Receive second reminder
  - Day -1: Receive final reminder
  - Each message includes [Renew Now] button

**Journey 4.3.2: Renew Subscription**
- **Trigger:** Click renewal link
- **Steps:**
  - Click [Renew] button
  - Bot shows same plan or options
  - Select plan (usually same)
  - Generate new invoice
  - Make payment
  - Subscription extended from current end date
  - No access interruption

**Journey 4.3.3: Early Renewal**
- **Trigger:** Want to renew before expiration
- **Steps:**
  - Send /renew command or check status
  - Click [Renew Now]
  - Same payment flow
  - Time added to current expiration date

**Journey 4.3.4: Subscription Expires (No Renewal)**
- **Trigger:** Expiration date reached, no payment
- **Steps:**
  - Receive expiration notice
  - Removed from channel automatically
  - Receive "Subscription expired" message
  - Offered option to resubscribe
  - Can resubscribe anytime

---

### 4.4 Plan Changes

**Journey 4.4.1: Upgrade to Higher Plan**
- **Trigger:** Want better tier mid-subscription
- **Steps:**
  - View plans
  - Select higher tier
  - Pay full price for new plan
  - Old subscription cancelled (no refund)
  - New plan activated

**Journey 4.4.2: Change Plan at Renewal**
- **Trigger:** Want different plan next cycle
- **Steps:**
  - Wait for expiration
  - At renewal, select different plan
  - Pay for new plan
  - New plan duration starts

---

### 4.5 Support & Help

**Journey 4.5.1: Get Help**
- **Trigger:** Need assistance
- **Steps:**
  - Send /help command
  - View FAQ and common issues
  - See contact options
  - Choose [Submit Ticket] if needed

**Journey 4.5.2: Report Payment Issue**
- **Trigger:** Paid but no access
- **Steps:**
  - Click [Check Payment Status]
  - Enter transaction hash
  - Bot checks payment
  - If found: "Processing, wait X minutes"
  - If not found: [Submit Ticket]
  - Provide details and TX hash

**Journey 4.5.3: Submit Support Ticket**
- **Trigger:** Issue not resolved
- **Steps:**
  - Click [Submit Ticket] or send /support
  - Select issue type
  - Describe problem
  - Provide transaction hash if payment-related
  - Attach screenshot if possible
  - Receive ticket confirmation
  - Wait for client/admin response

**Journey 4.5.4: Contact Channel Owner**
- **Trigger:** Need to reach client directly
- **Steps:**
  - Send /support
  - Bot provides client contact info (if set)
  - Or message forwarded to client

---

### 4.6 Channel Interaction

**Journey 4.6.1: Receive Welcome in Channel**
- **Trigger:** First join after subscription
- **Steps:**
  - Join channel via invite link
  - See welcome message from channel
  - Review channel rules
  - Start receiving content

**Journey 4.6.2: Lost Access Recovery**
- **Trigger:** Accidentally left channel
- **Steps:**
  - Try to rejoin channel
  - Click "Request to Join"
  - Bot checks subscription (still active)
  - Auto-approved
  - Rejoin successful

---

### 4.7 Account & Privacy

**Journey 4.7.1: Request Data Export**
- **Trigger:** Want personal data
- **Steps:**
  - Send /privacy command
  - Click [Export My Data]
  - Confirm request
  - Receive data file (if supported)

**Journey 4.7.2: Request Data Deletion**
- **Trigger:** Want to be forgotten
- **Steps:**
  - Send /privacy
  - Click [Delete My Data]
  - Read consequences
  - Type "CONFIRM"
  - Subscription cancelled
  - Access revoked
  - Data deleted
  - Bot confirms deletion

---

## 5. SYSTEM-INITIATED JOURNEYS

### 5.1 Automated Subscription Processing

**Journey 5.1.1: Hourly Subscription Expiration Check**
- **Trigger:** Cron job every hour
- **Process:**
  - Query expired subscriptions
  - Update status to EXPIRED
  - Revoke channel access (banChatMember)
  - Send expiration notification to subscriber
  - Log access revocation

**Journey 5.1.2: Daily Trial Expiration Check**
- **Trigger:** Daily at 00:00 UTC
- **Process:**
  - Query trials expiring today
  - Check for payment
  - If no payment: pause all bots, notify client
  - If paid: already processed via webhook

**Journey 5.1.3: Renewal Reminder Sending**
- **Trigger:** Daily check for upcoming expirations
- **Process:**
  - Query subscriptions expiring in 7 days → send reminder
  - Query subscriptions expiring in 3 days → send reminder
  - Query subscriptions expiring in 1 day → send reminder

---

### 5.2 Payment Processing

**Journey 5.2.1: Webhook Receipt & Processing**
- **Trigger:** NOWPayments sends webhook
- **Process:**
  - Receive POST request
  - Validate signature
  - Check idempotency
  - Process payment status
  - Update database
  - Grant/revoke access
  - Send confirmation
  - Return HTTP 200

**Journey 5.2.2: Webhook Retry Mechanism**
- **Trigger:** Backend fails to process webhook
- **Process:**
  - NOWPayments retries: 1min, 5min, 15min, 1hr, 6hr
  - Backend processes on successful retry
  - If all fail: manual intervention queue

**Journey 5.2.3: Daily Payment Reconciliation**
- **Trigger:** Daily at 02:00 UTC
- **Process:**
  - Query NOWPayments for recent payments
  - Compare with local transaction records
  - Identify mismatches
  - Auto-heal missing webhooks
  - Alert admin if issues found

---

### 5.3 Monitoring & Alerts

**Journey 5.3.1: Bot Health Check**
- **Trigger:** Every 5 minutes
- **Process:**
  - Ping all active bots
  - Check response time
  - Log any failures
  - Alert admin if down >5 minutes

**Journey 5.3.2: Rate Limit Monitoring**
- **Trigger:** Continuous
- **Process:**
  - Track API calls per bot
  - If approaching limit: throttle requests
  - If hit: queue operations, alert admin

**Journey 5.3.3: Error Rate Alerting**
- **Trigger:** Error threshold exceeded
- **Process:**
  - Monitor error logs
  - If error rate >5%: WARNING alert
  - If error rate >10%: CRITICAL alert
  - Send notification to admin

---

### 5.4 Data Maintenance

**Journey 5.4.1: Archive Old Data**
- **Trigger:** Monthly at 03:00 UTC
- **Process:**
  - Archive transactions >1 year old
  - Archive deleted accounts >30 days
  - Compress logs >90 days
  - Update storage metrics

**Journey 5.4.2: Cleanup Expired Invoices**
- **Trigger:** Daily at 04:00 UTC
- **Process:**
  - Query invoices >24 hours old with status PENDING
  - Mark as EXPIRED
  - Clean up temporary data

---

## Journey Count Summary

| Category | Journey Count |
|----------|--------------|
| **Platform Admin → Main Bot** | 23 journeys |
| **Client → Main Bot** | 42 journeys |
| **Client → Selling Bot** | 2 journeys |
| **Subscriber → Selling Bot** | 26 journeys |
| **System-Initiated** | 12 journeys |
| **TOTAL** | **105 user journeys** |

---

## Priority Tiers for Development

### **Tier 1 (MVP - Must Have)**
- Client registration & bot setup
- Subscriber purchase flow
- Payment processing (webhooks)
- Access grant/revoke
- Subscription expiration
- Trial management

### **Tier 2 (Launch - Should Have)**
- Dashboard & analytics
- Subscriber management (manual actions)
- Renewal reminders
- Platform subscription management
- Basic admin monitoring

### **Tier 3 (Post-Launch - Nice to Have)**
- Advanced analytics
- Bulk operations
- Fraud detection
- GDPR compliance
- Advanced admin tools

---

**Document Status:** Complete  
**Total Journeys Documented:** 105  
**Last Updated:** January 25, 2026