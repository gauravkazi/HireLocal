# HireLocal Database Schema

MongoDB Atlas (NoSQL, via Mongoose). Five main collections, related through ObjectId references.


## User

| Field | Type | Notes |
|---|---|---|
| name | String | Required |
| email | String | Required, unique |
| password | String | Required, hashed with bcrypt |
| role | String | Enum: `customer`, `provider`, `admin`. Default: `customer` |
| profilePicture | String | URL, default empty |
| createdAt / updatedAt | Date | Auto-generated |


## ProviderProfile

| Field | Type | Notes |
|---|---|---|
| user | ObjectId | References `User`, required, unique (one profile per provider) |
| bio | String | Default empty |
| skills | [String] | Array of skill tags |
| experience | String | e.g. "3 years" |
| pricing | Number | Base/starting price |
| portfolio | [Object] | Each item: `title`, `description`, `imageUrl` |
| profilePicture | String | Cloudinary URL |
| averageRating | Number | Auto-calculated from Reviews, default 0 |
| createdAt / updatedAt | Date | Auto-generated |


## Service

| Field | Type | Notes |
|---|---|---|
| provider | ObjectId | References `User`, required |
| title | String | Required |
| description | String | Required |
| category | String | Enum: Website Development, Logo Design, Social Media Management, Content Writing, Digital Marketing, Other |
| price | Number | Required |
| deliveryTime | String | e.g. "3 days" |
| createdAt / updatedAt | Date | Auto-generated |


## ServiceRequest

| Field | Type | Notes |
|---|---|---|
| customer | ObjectId | References `User`, required |
| provider | ObjectId | References `User`, required |
| service | ObjectId | References `Service`, required |
| requirements | String | Required |
| budget | Number | Required |
| deadline | Date | Required |
| status | String | Enum: Pending, Accepted, In Progress, Completed, Delivered. Default: Pending |
| createdAt / updatedAt | Date | Auto-generated |


## Review

| Field | Type | Notes |
|---|---|---|
| customer | ObjectId | References `User`, required |
| provider | ObjectId | References `User`, required |
| request | ObjectId | References `ServiceRequest`, required, unique (one review per request) |
| rating | Number | Required, min 1, max 5 |
| feedback | String | Default empty |
| createdAt / updatedAt | Date | Auto-generated |


## ActivityLog

| Field | Type | Notes |
|---|---|---|
| user | ObjectId | References `User`, required |
| action | String | e.g. "User registered", "Service created" |
| details | String | Extra context, default empty |
| createdAt / updatedAt | Date | Auto-generated |


## Relationships Overview

```
User (1) ──── (1) ProviderProfile
User (1) ──── (many) Service
User (1) ──── (many) ServiceRequest [as customer]
User (1) ──── (many) ServiceRequest [as provider]
Service (1) ──── (many) ServiceRequest
ServiceRequest (1) ──── (1) Review
User (1) ──── (many) ActivityLog
```