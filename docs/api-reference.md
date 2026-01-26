# TeleTrade API Reference

## Base URL

```
http://localhost:3000/api
```

---

## Authentication

All API endpoints require authentication. Include the admin token in headers:

```
Authorization: Bearer <admin-token>
```

---

## Endpoints

### Clients

#### GET /api/clients

List all clients.

**Response:**

```json
{
    "clients": [
        {
            "id": "cuid",
            "businessName": "Premium Signals",
            "status": "ACTIVE",
            "createdAt": "2026-01-26T12:00:00Z",
            "_count": { "sellingBots": 2 }
        }
    ]
}
```

#### GET /api/clients/:id

Get client details.

#### POST /api/clients/:id/approve

Approve a pending client.

#### POST /api/clients/:id/suspend

Suspend a client (pauses all bots).

**Body:**

```json
{
    "reason": "Terms violation"
}
```

#### GET /api/stats

Get platform statistics.

**Response:**

```json
{
    "clients": { "total": 50, "active": 40, "trial": 5 },
    "bots": { "total": 100, "active": 85 },
    "subscribers": { "total": 5000, "active": 3500 }
}
```

---

### Bots

#### GET /api/bots

List all bots. Optional query: `?clientId=xxx`

#### GET /api/bots/:id

Get bot details.

#### POST /api/bots/:id/pause

Pause a bot.

#### POST /api/bots/:id/activate

Activate a paused bot.

#### GET /api/bots/:id/subscribers

Get subscribers for a bot. Optional query: `?status=ACTIVE`

---

### Subscribers

#### GET /api/subscribers/:id

Get subscriber details with payment history.

#### POST /api/subscribers/:id/extend

Extend subscriber access.

**Body:**

```json
{
    "days": 30,
    "reason": "Loyalty reward",
    "performerId": "admin-id",
    "performerType": "ADMIN"
}
```

#### POST /api/subscribers/:id/revoke

Revoke subscriber access.

**Body:**

```json
{
    "reason": "Rule violation",
    "performerId": "client-id",
    "performerType": "CLIENT"
}
```

---

### Plans

#### GET /api/plans

List all plans. Optional queries: `?botId=xxx`, `?type=PLATFORM|CLIENT`

#### POST /api/plans

Create a new plan.

**Body:**

```json
{
    "botId": "bot-id",
    "planType": "CLIENT",
    "name": "Monthly Premium",
    "description": "Full access",
    "durationDays": 30,
    "priceAmount": 50,
    "priceCurrency": "USDT"
}
```

#### PATCH /api/plans/:id

Update a plan.

#### DELETE /api/plans/:id

Deactivate a plan (soft delete).

---

## Webhooks

### POST /webhooks/nowpayments

NOWPayments IPN callback endpoint.

**Headers:**

- `x-nowpayments-sig`: HMAC signature

**Payload:** NOWPayments standard IPN payload

---

## Error Responses

All errors follow this format:

```json
{
    "error": "Error message"
}
```

**Status Codes:**

- `200` - Success
- `400` - Bad Request
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error
