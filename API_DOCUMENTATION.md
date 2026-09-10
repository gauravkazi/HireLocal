# HireLocal API Documentation

HireLocal is a multi-vendor service marketplace API. This document describes every available endpoint, grouped by feature.

## Base URLs

| Environment | URL |
|---|---|
| Production | `https://hirelocal-backend.onrender.com/api` |
| Local Development | `http://localhost:5002/api` |

## Authentication

Protected routes require a JSON Web Token, sent in the request header:

```
Authorization: Bearer <token>
```

A token is obtained from the **Register** or **Login** endpoints and remains valid for 30 days.

## Roles

| Role | Description |
|---|---|
| `customer` | Browses services, submits requests, leaves reviews |
| `provider` | Creates service listings, manages requests, tracks earnings |
| `admin` | Views platform-wide statistics and activity logs |

## Response Format

Successful responses return the requested resource (object or array) with an appropriate 2xx status code. Errors return:

```json
{ "message": "Description of what went wrong" }
```

## Email Notifications

Two endpoints in this API trigger a transactional email as a side effect, in addition to their normal response: **Create a request** (4.1) and **Update request status** (4.5). Emails are sent via the [Resend](https://resend.com) API from `utils/sendEmail.js`, and are marked inline below wherever they apply.

> **Note:** emails are currently sent from Resend's shared sandbox domain (`onboarding@resend.dev`), since verifying a custom sending domain requires owning a domain name. The API call itself completes successfully and is logged as sent on Resend's dashboard in every case, but final inbox delivery can be inconsistent with some providers (notably Gmail) due to spam filtering of shared sender domains. This is an email-deliverability characteristic of the shared domain, not an application bug — in production this would be resolved by verifying a dedicated sending domain.

## 1. Authentication

### 1.1 Register a new user
`POST /auth/register`
**Access:** Public

| Field | Type | Required | Notes |
|---|---|---|---|
| name | String | Yes | |
| email | String | Yes | Must be unique |
| password | String | Yes | Will be hashed |
| role | String | No | `customer` or `provider`. Defaults to `customer` |

**Example request body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "123456",
  "role": "customer"
}
```

**Success response — 201:**
```json
{
  "_id": "652f1a...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "token": "eyJhbGciOi..."
}
```

**Error responses:**
- `400` — missing fields, or a user already exists with that email

### 1.2 Log in
`POST /auth/login`
**Access:** Public

| Field | Type | Required |
|---|---|---|
| email | String | Yes |
| password | String | Yes |

**Example request body:**
```json
{
  "email": "john@example.com",
  "password": "123456"
}
```

**Success response — 200:** same shape as Register.

**Error responses:**
- `400` — invalid email or password

## 2. Provider Profiles

### 2.1 Create provider profile
`POST /providers/profile`
**Access:** Private — `provider`

**Example request body:**
```json
{
  "bio": "Experienced web developer",
  "skills": ["Web Development", "React"],
  "experience": "3 years",
  "pricing": 500
}
```

**Success response — 201:** the created profile object.

**Error responses:**
- `400` — profile already exists for this user

### 2.2 Update provider profile
`PUT /providers/profile`
**Access:** Private — `provider`
**Content-Type:** `multipart/form-data`

| Field | Type | Notes |
|---|---|---|
| bio | Text | |
| skills | Text | Comma-separated or repeated field |
| experience | Text | |
| pricing | Text | |
| profilePicture | File | Optional. Uploaded to Cloudinary |

**Success response — 200:** the updated profile object, with `profilePicture` set to the new Cloudinary URL if a file was uploaded.

### 2.3 Get my provider profile
`GET /providers/profile`
**Access:** Private — `provider`

**Success response — 200:** the logged-in provider's profile, with `user` populated (`name`, `email`, `role`).


### 2.4 Get a provider's public profile
`GET /providers/:id`
**Access:** Public

**Success response — 200:** the provider profile matching the given profile ID.

**Error responses:**
- `404` — profile not found

## 3. Service Listings

### 3.1 Create a service
`POST /services`
**Access:** Private — `provider`

| Field | Type | Required |
|---|---|---|
| title | String | Yes |
| description | String | Yes |
| category | String | Yes — see allowed values below |
| price | Number | Yes |
| deliveryTime | String | Yes, e.g. `"3 days"` |

**Allowed categories:** `Website Development`, `Logo Design`, `Social Media Management`, `Content Writing`, `Digital Marketing`, `Other`

**Success response — 201:** the created service object.

### 3.2 Browse all services
`GET /services`
**Access:** Public

**Query parameters (optional):**

| Param | Description |
|---|---|
| category | Filter by exact category |
| search | Case-insensitive match against the title |

**Success response — 200:** array of services, each with `provider` populated (`name`, `email`).

### 3.3 Get a single service
`GET /services/:id`
**Access:** Public

**Success response — 200:** the service, with `provider` populated.

**Error responses:**
- `404` — service not found

### 3.4 Get my services
`GET /services/my-services`
**Access:** Private — `provider`

**Success response — 200:** array of services created by the logged-in provider.

### 3.5 Update a service
`PUT /services/:id`
**Access:** Private — `provider`, must own the listing

Accepts any subset of: `title`, `description`, `category`, `price`, `deliveryTime`.

**Success response — 200:** the updated service.

**Error responses:**
- `403` — not the owner of this service
- `404` — service not found

### 3.6 Delete a service
`DELETE /services/:id`
**Access:** Private — `provider`, must own the listing

**Success response — 200:**
```json
{ "message": "Service deleted successfully" }
```

## 4. Service Requests & Project Tracking

### 4.1 Create a request
`POST /requests`
**Access:** Private — `customer`

| Field | Type | Required |
|---|---|---|
| serviceId | String | Yes — ID of the service being requested |
| requirements | String | Yes |
| budget | Number | Yes |
| deadline | Date | Yes |

**Example request body:**
```json
{
  "serviceId": "652f1a...",
  "requirements": "Need a modern minimalist logo",
  "budget": 200,
  "deadline": "2026-09-20"
}
```

**Success response — 201:** the created request, `status` defaults to `Pending`. The `provider` field is filled in automatically from the service.

> 📧 **Email notification:** sends an email to the provider (`"New Service Request — HireLocal"`), including the service title, requirements, budget, and deadline. See the Email Notifications note near the top of this document regarding deliverability.


### 4.2 Get my requests
`GET /requests/my-requests`
**Access:** Private — `customer`

**Success response — 200:** array of the customer's own requests, with `provider` and `service` populated.

### 4.3 Get received requests
`GET /requests/received-requests`
**Access:** Private — `provider`

**Success response — 200:** array of requests assigned to the logged-in provider, with `customer` and `service` populated.

### 4.4 Get a single request
`GET /requests/:id`
**Access:** Private — only the involved customer or provider

**Success response — 200:** the request, fully populated.

**Error responses:**
- `403` — not the customer or provider on this request
- `404` — request not found

### 4.5 Update request status
`PUT /requests/:id/status`
**Access:** Private — `provider`, must be assigned to the request

| Field | Type | Required |
|---|---|---|
| status | String | Yes |

**Allowed values (in workflow order):** `Pending` → `Accepted` → `In Progress` → `Completed` → `Delivered`

**Example request body:**
```json
{ "status": "Accepted" }
```

**Success response — 200:** the updated request.

> 📧 **Email notification:** sends an email to the customer (`"Your Request Status Has Changed — HireLocal"`), including the new status. See the Email Notifications note near the top of this document regarding deliverability.

**Error responses:**
- `400` — invalid status value
- `403` — not the assigned provider

## 5. Reviews & Ratings

### 5.1 Submit a review
`POST /reviews`
**Access:** Private — `customer`

| Field | Type | Required |
|---|---|---|
| requestId | String | Yes |
| rating | Number | Yes — 1 to 5 |
| feedback | String | No |

**Rules:**
- Only the customer who made the request can review it
- The request must have status `Delivered`
- One review per request

**Example request body:**
```json
{
  "requestId": "652f1a...",
  "rating": 5,
  "feedback": "Great work, delivered on time!"
}
```

**Success response — 201:** the created review. The provider's `averageRating` on their `ProviderProfile` is recalculated automatically.

**Error responses:**
- `400` — request not yet delivered, or already reviewed
- `403` — not the customer on this request

### 5.2 Get a provider's reviews
`GET /reviews/provider/:providerId`
**Access:** Public

**Success response — 200:** array of reviews for that provider, with `customer` name populated.

## 6. Dashboards

### 6.1 Customer dashboard
`GET /dashboard/customer`
**Access:** Private — `customer`

**Success response — 200:**
```json
{
  "profile": { "...": "the customer's own user info" },
  "activeRequestsCount": 2,
  "completedProjectsCount": 1,
  "activeRequests": [ "..." ],
  "completedProjects": [ "..." ]
}
```

### 6.2 Provider dashboard
`GET /dashboard/provider`
**Access:** Private — `provider`

**Success response — 200:**
```json
{
  "pendingRequestCount": 3,
  "activeProjectsCount": 1,
  "totalEarnings": 450,
  "pendingRequests": [ "..." ],
  "activeProjects": [ "..." ]
}
```

`totalEarnings` is the sum of `budget` across all requests with status `Delivered`.

### 6.3 Admin dashboard
`GET /dashboard/admin`
**Access:** Private — `admin`

**Success response — 200:**
```json
{
  "userStats": {
    "totalUsers": 10,
    "totalCustomer": 4,
    "totalProvider": 5
  },
  "serviceStats": {
    "totalServices": 6
  },
  "projectStats": {
    "totalRequests": 12,
    "pendingCount": 5,
    "inProgressCount": 2,
    "deliveredCount": 3
  }
}
```

### 6.4 Activity logs
`GET /dashboard/admin/logs`
**Access:** Private — `admin`

**Success response — 200:** the 50 most recent activity log entries, newest first.

```json
[
  {
    "_id": "...",
    "user": { "name": "...", "email": "...", "role": "..." },
    "action": "Service created",
    "details": "Logo Design",
    "createdAt": "2026-09-09T04:25:56.802Z"
  }
]
```

## Quick Reference Table

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | `/auth/register` | Public | |
| POST | `/auth/login` | Public | |
| POST | `/providers/profile` | Provider | |
| PUT | `/providers/profile` | Provider | |
| GET | `/providers/profile` | Provider | |
| GET | `/providers/:id` | Public | |
| POST | `/services` | Provider | |
| GET | `/services` | Public | |
| GET | `/services/:id` | Public | |
| GET | `/services/my-services` | Provider | |
| PUT | `/services/:id` | Provider (owner) | |
| DELETE | `/services/:id` | Provider (owner) | |
| POST | `/requests` | Customer | 📧 emails provider |
| GET | `/requests/my-requests` | Customer | |
| GET | `/requests/received-requests` | Provider | |
| GET | `/requests/:id` | Customer/Provider (involved) | |
| PUT | `/requests/:id/status` | Provider (assigned) | 📧 emails customer |
| POST | `/reviews` | Customer | |
| GET | `/reviews/provider/:providerId` | Public | |
| GET | `/dashboard/customer` | Customer | |
| GET | `/dashboard/provider` | Provider | |
| GET | `/dashboard/admin` | Admin | |
| GET | `/dashboard/admin/logs` | Admin | |