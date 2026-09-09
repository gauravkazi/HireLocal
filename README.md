# HireLocal — Multi-Vendor Service Marketplace Platform

HireLocal is a full-stack multi-vendor service marketplace where customers can browse services, hire local freelancers, submit service requests, and track project progress from start to delivery — built as part of the ZI Core Internship (FSWD-1) task.

The platform simulates real-world marketplaces like Fiverr and Upwork, tailored for a Nepali audience (pricing in NPR).

## Live Links

- **Frontend (Live App):** https://hire-local.vercel.app
- **Backend API:** https://hirelocal-backend.onrender.com
- **GitHub Repository:** https://github.com/gauravkazi/HireLocal

> Note: The backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while the server wakes up.

## Features

### Authentication & Authorization
- User registration and login with JWT authentication
- Password hashing with bcrypt
- Role-based access control (Customer, Service Provider, Admin)

### Provider Profiles
- Create and update provider profile (bio, skills, experience, pricing)
- Upload profile picture via Cloudinary

### Service Listings
- Providers can create, update, and delete service listings
- Categories: Website Development, Logo Design, Social Media Management, Content Writing, Digital Marketing, Other

### Service Requests
- Customers can browse, search, and filter services by category
- Submit a service request with requirements, budget, and deadline

### Project Tracking
- Status workflow: Pending → Accepted → In Progress → Completed → Delivered
- Providers update status; customers track progress in real time

### Reviews & Ratings
- Customers can rate (1–5) and leave feedback after a delivered project
- Provider's average rating is automatically recalculated on each new review

### Dashboards
- **Customer:** Active requests, completed projects
- **Provider:** Pending requests, active projects, total earnings
- **Admin:** User, service, and project statistics

### Bonus Features
- Dark Mode (persisted across sessions)
- Activity Logs (tracks key user actions, viewable by admin)
- Responsive design (desktop, tablet, mobile)

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS v4, React Router DOM, Axios, lucide-react

**Backend:** Node.js, Express.js

**Database:** MongoDB Atlas (Mongoose)

**Authentication:** JWT, bcrypt

**File Uploads:** Cloudinary, Multer

**Deployment:** Render (backend), Vercel (frontend)

## Project Structure
HireLocal/
├── backend/
│ ├── config/ # DB and Cloudinary configuration
│ ├── models/ # Mongoose schemas
│ ├── controllers/ # Route handler logic
│ ├── routes/ # API route definitions
│ ├── middleware/ # Auth, role, and upload middleware
│ ├── utils/ # Helper functions (JWT, activity logging)
│ └── server.js # App entry point
│
└── frontend/
├── src/
│ ├── api/ # Axios instance
│ ├── context/ # Auth and Theme context providers
│ ├── components/ # Reusable UI components (Navbar)
│ ├── pages/ # Route-level pages
│ └── App.jsx # Route definitions
└── ...


## Running Locally

### Backend
```bash
cd backend
npm install
```
Create a `.env` file in `backend/` with:
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

Then run:
```bash
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
By default the frontend points to the deployed backend. To point to a local backend instead, update `src/api/axios.js`:
```js
baseURL: 'http://localhost:5002/api',
```

## User Roles for Testing

| Role | Example |
|---|---|
| Customer | Register with role "Customer" |
| Service Provider | Register with role "Service Provider" |
| Admin | Created directly via API (not exposed on public registration form) |

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for full endpoint details.

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for collection structures and relationships.


## Backend Design Decisions

A few notes on architecture choices made while building the API:

- **Denormalized `provider` reference on `ServiceRequest`.** Rather than deriving the provider through the linked `Service` document on every read, `provider` is stored directly on each request at creation time. This keeps "my received requests" and "provider dashboard" queries a single `find()` call instead of a nested lookup, at the cost of a small amount of duplicated data.

- **Role-based access via composable middleware.** `protect` verifies the JWT and attaches the user to `req.user`; `restrictTo(...roles)` is a separate, reusable middleware that checks `req.user.role` against an allowed list. Routes compose both (`protect, restrictTo('provider'), handler`), keeping authorization logic out of controllers entirely.

- **Average rating is recalculated on write, not on read.** When a review is created, the provider's `averageRating` is recomputed from all their reviews and saved to their `ProviderProfile` immediately. This trades a slightly heavier write for fast, index-free reads anywhere the rating is displayed (browse listings, profile pages).

- **Status transitions are validated server-side against a fixed enum**, both in the Mongoose schema and again in the controller before the update is applied — so an invalid status can't be persisted even if a request bypasses the frontend's dropdown.

- **File uploads go directly to Cloudinary via Multer's storage engine**, never touching the server's local disk. This keeps the API stateless and safe to run on ephemeral hosting (Render's free tier restarts the filesystem on redeploy).

- **Ownership checks are explicit, not implicit.** Update/delete on a `Service` or a status change on a `ServiceRequest` compares the resource's owner ID against `req.user._id` inside the controller, rather than relying solely on role checks — so a provider can only modify their own listings, not any provider's.

## Author

Gaurav Thapa — ZI Core Internship (September Batch), Task FSWD-1