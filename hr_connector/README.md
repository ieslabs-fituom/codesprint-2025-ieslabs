# Workday Fingerprint Connector Documentation

## 1. Introduction

The **Workday Fingerprint Connector** is a standalone FastAPI service designed to bridge the fingerprint verification device with Workday’s Time Tracking module. It accepts IN/OUT swipe events from the biometric device, authenticates with Workday via OAuth2, and posts time-clock events in real time.

> **Target Audience**: HR automation engineers, backend developers, and DevOps teams new to Workday integrations.

## 2. Key Features

- **OAuth2 Client Credentials** token management with transparent caching
- **REST** calls to Workday’s `/timeClockEvents` endpoint
- **Pydantic** data validation for incoming fingerprint events
- **AsyncIO**-powered HTTP client (`httpx.AsyncClient`) for non-blocking calls
- **Error handling** with clear HTTPException responses
- **Configurable** via environment variables
- **CORS** middleware (lockable for production)

## 3. Workday Configuration

To integrate, you need:

1. **Workday Tenant Host**: e.g. `wd2-impl-services1.workday.com`
2. **Tenant Name**: unique Workday tenant identifier
3. **Integration System User** with **Client ID** & **Client Secret** (OAuth2 credentials)
4. **API Permissions**: grant `Time Tracking Service` scopes to your ISU

Obtain these from your Workday administrator and populate your `.env` accordingly.

## 4. Information Exchange

### 4.1. Payload Format

| Field          | Type    | Description                                  |
| -------------- | ------- | -------------------------------------------- |
| `employee_wid` | String  | Unique Workday worker identifier.            |
| `timestamp`    | ISO8601 | Event date/time, e.g. `2025-06-16T08:15:00Z` |
| `event_type`   | Enum    | `IN` or `OUT`                                |

_All payloads are sent as JSON over HTTPS._

### 4.2. Authentication

- Uses **OAuth2 Client Credentials** flow.
- Connector requests a token from Workday’s `/token` endpoint and caches it until near expiry.

---

## 5. Getting Started

### 5.1. Prerequisites

- A **Workday tenant** with Time Tracking API permissions.
- An **Integration System User** (ISU) in Workday with a Client ID and Secret.
- A **biometric device or SDK** capable of sending HTTP POSTs.

### 5.2. Quick Launch Steps

1. **Clone or install** the connector code into its own folder (e.g. `workday_connector/`).
2. Create a **`.env`** file with:

   ```ini
   WORKDAY_HOST=your-tenant.workday.com
   TENANT=yourTenantID
   CLIENT_ID=…
   CLIENT_SECRET=…
   ```

3. **Install dependencies** and run:

   ```bash
   python -m venv venv
   source venv/bin/activate      # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

4. Configure your **biometric device** or SDK to POST events to `http://<connector-host>/events/`.

---

## 6. Operational Details

- **Health Check**: `GET /health` returns service status.
- **Event Endpoint**: `POST /events/` accepts the JSON payload and forwards to Workday.
- **Error Responses**: On failure, the connector returns an HTTP error code with details for troubleshooting.

---

## 7. Security & Compliance

- **HTTPS Only**: Ensure the connector is behind TLS.
- **Secrets Management**: Store credentials in environment variables or a secrets vault; never commit to code.
- **CORS Restrictions**: Lock down allowed origins to trusted device IPs.

---

## 8. Support & Extensions

- **Monitoring**: Log request and response statuses for audits.
- **Retry Logic**: Implement exponential backoff for transient network issues.
- **Bulk Upload**: Optionally batch multiple events in a single call.
- **Worker Lookup**: Add an endpoint to retrieve `employee_wid` by email or badge ID.
