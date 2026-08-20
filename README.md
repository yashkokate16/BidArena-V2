# BidArena Backend

A production-ready REST API and real-time backend for **BidArena**, an online auction platform where users can create auctions, place bids, track auction activity, and receive real-time bid updates.

**Stack:** Node.js · Express.js · MongoDB · Mongoose · JWT · Socket.IO

> **Live API:** https://bidarena-v2-backend.onrender.com
>
> **GitHub:** https://github.com/yashkokate16/BidArena-V2

## Features

- User registration and login
- JWT access and refresh tokens
- HTTP-only authentication cookies
- Protected routes with authentication middleware
- Auction CRUD operations
- Auction ownership authorization
- Auction lifecycle: `upcoming → live → ended`
- Automatic auction status processing
- Bid placement and validation
- Current-price updates
- User and auction bid history
- Real-time bidding with Socket.IO
- Auction-specific Socket.IO rooms
- Centralized `ApiError` handling
- Production deployment support

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Database |
| Mongoose | MongoDB ODM |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Socket.IO | Real-time communication |
| Zod | Environment validation |
| Cookie Parser | Cookie handling |
| CORS | Cross-origin requests |

## Architecture

```text
Client
  ↓
Routes
  ↓
Controllers
  ↓
Services
  ↓
DAO
  ↓
MongoDB
```

Real-time bidding:

```text
Client
  ↓
POST /api/bids/:auctionId
  ↓
Bid Service
  ├── Validate bid
  ├── Save bid
  ├── Update currentPrice
  └── Emit newBid
          ↓
auction:<auctionId>
          ↓
Connected clients
```

### Layer responsibilities

- **Routes:** Define endpoints and middleware.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain business rules and validation.
- **DAO:** Handle database operations.
- **Models:** Define Mongoose schemas.
- **Middleware:** Handle authentication.
- **Socket.IO:** Provide real-time auction updates.

## Project Structure

```text
server/
├── src/
│   ├── config/
│   ├── controller/
│   ├── dao/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── socket/
│   └── utils/
├── .env
├── package.json
└── server.js
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB or MongoDB Atlas
- Git

### Installation

```bash
git clone https://github.com/yashkokate16/BidArena-V2.git
cd BidArena-V2/server
npm install
```

Create `server/.env`:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLIENT_URL=http://localhost:5173
```

Start development:

```bash
npm run dev
```

Start production:

```bash
npm start
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Server port |
| `MONGODB_URI` | MongoDB connection string |
| `ACCESS_TOKEN_SECRET` | Secret used to sign access tokens |
| `REFRESH_TOKEN_SECRET` | Secret used to sign refresh tokens |
| `CLIENT_URL` | Allowed frontend origin for CORS |

Never commit `.env`. Use `.env.example` for public configuration templates.

## API Base URL

Local:

```text
http://localhost:8000
```

Production:

```text
https://bidarena-v2-backend.onrender.com
```

# API Reference

## Health Check

### `GET /`

Checks whether the backend is running.

Response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

# Authentication

Base path:

```text
/api/auth
```

Authentication uses access and refresh tokens stored in HTTP-only cookies.

For browser clients, send credentials with cross-origin requests:

```js
axios.get("YOUR_RENDER_URL/api/auth/me", {
  withCredentials: true
});
```

### Register

`POST /api/auth/register`

Request:

```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

`POST /api/auth/login`

Request:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Logout

`GET /api/auth/logout`

Clears authentication cookies.

### Current User

`GET /api/auth/me`

**Authentication required.**

Response:

```json
{
  "success": true,
  "message": "User fetched successfully",
  "user": {
    "name": "John Doe",
    "id": "USER_ID",
    "email": "john@example.com"
  }
}
```

### Refresh Access Token

`POST /api/auth/refresh`

Uses the refresh-token cookie to create a new access token.

---

# Auctions

Base path:

```text
/api/auctions
```

Auction fields include:

```text
title
description
image
startingPrice
currentPrice
startTime
endTime
status
createdBy
winner
```

Possible statuses:

```text
upcoming
live
ended
```

### Create Auction

`POST /api/auctions`

**Authentication required.**

Request:

```json
{
  "title": "Gaming Laptop",
  "description": "High-performance gaming laptop",
  "image": "https://example.com/laptop.jpg",
  "startingPrice": 50000,
  "startTime": "2026-09-01T10:00:00.000Z",
  "endTime": "2026-09-01T18:00:00.000Z"
}
```

The authenticated user becomes `createdBy`.

Validation includes:

- Required fields
- Non-negative starting price
- End time after start time

### Get All Auctions

`GET /api/auctions/all-auctions`

### Get Auction By ID

`GET /api/auctions/:id`

### Update Auction

`PATCH /api/auctions/:auctionId`

**Authentication required.**

Allowed fields:

```text
title
description
image
startingPrice
startTime
endTime
```

Only the auction creator can update the auction.

### Delete Auction

`DELETE /api/auctions/:auctionId`

**Authentication required.**

### End Auction

`PATCH /api/auctions/:auctionId/end`

**Authentication required.**

---

# Auction Lifecycle

```text
upcoming
    │
    │ startTime reached
    ▼
  live
    │
    │ endTime reached
    ▼
 ended
```

The backend runs auction status processing so time-based auction state can be updated automatically.

---

# Bids

Base path:

```text
/api/bids
```

### Place Bid

`POST /api/bids/:auctionId`

**Authentication required.**

Request:

```json
{
  "amount": 60000
}
```

The backend checks:

- Auction exists
- Bidder is not the auction creator
- Auction has not ended
- Bid amount is provided
- Bid amount is greater than the current price

After a successful bid:

```text
Create bid
   ↓
Update auction.currentPrice
   ↓
Save auction
   ↓
Broadcast real-time update
```

### Get Auction Bids

`GET /api/bids/:auctionId`

Returns bids for an auction.

### Get My Bids

`GET /api/bids/my-bids`

**Authentication required.**

Returns bids placed by the authenticated user.

---

# Socket.IO

BidArena uses Socket.IO for real-time auction updates.

Connect from a client:

```js
import { io } from "socket.io-client";

const socket = io("YOUR_RENDER_URL", {
  withCredentials: true
});
```

## Auction Rooms

Each auction uses a dedicated room:

```text
auction:<auctionId>
```

Join:

```js
socket.emit("joinAuction", auctionId);
```

Leave:

```js
socket.emit("leaveAuction", auctionId);
```

Listen for new bids:

```js
socket.on("newBid", (data) => {
  console.log("New bid:", data);
});
```

A successful bid can be broadcast with data such as:

```json
{
  "bid": {},
  "currentPrice": 60000
}
```

The exact payload follows the current Socket.IO server implementation.

---

# API Summary

| Method | Endpoint | Auth |
|---|---|---|
| `GET` | `/` | No |
| `POST` | `/api/auth/register` | No |
| `POST` | `/api/auth/login` | No |
| `GET` | `/api/auth/logout` | No |
| `GET` | `/api/auth/me` | Yes |
| `POST` | `/api/auth/refresh` | No |
| `POST` | `/api/auctions` | Yes |
| `GET` | `/api/auctions/all-auctions` | No |
| `GET` | `/api/auctions/:id` | No |
| `PATCH` | `/api/auctions/:auctionId` | Yes |
| `DELETE` | `/api/auctions/:auctionId` | Yes |
| `PATCH` | `/api/auctions/:auctionId/end` | Yes |
| `POST` | `/api/bids/:auctionId` | Yes |
| `GET` | `/api/bids/:auctionId` | No |
| `GET` | `/api/bids/my-bids` | Yes |

---

# Error Handling

Expected application errors use `ApiError`.

Example:

```js
throw new ApiError(
  400,
  "Bid must be higher than current price"
);
```

Response:

```json
{
  "success": false,
  "message": "Bid must be higher than current price"
}
```

Common status codes:

| Status | Meaning |
|---:|---|
| `200` | Success |
| `201` | Resource created |
| `400` | Bad request / validation error |
| `401` | Authentication required or invalid |
| `403` | Forbidden |
| `404` | Resource not found |
| `409` | Conflict |
| `500` | Internal server error |

---

# Frontend Integration

### Axios

```js
import axios from "axios";

const response = await axios.post(
  "YOUR_RENDER_URL/api/bids/AUCTION_ID",
  {
    amount: 60000
  },
  {
    withCredentials: true
  }
);

console.log(response.data);
```

### Recommended flow

```text
Register
   ↓
Login
   ↓
GET /api/auth/me
   ↓
Get auctions
   ↓
Open auction
   ↓
Get bid history
   ↓
Join Socket.IO auction room
   ↓
Place bid
   ↓
Receive newBid
   ↓
Update UI
```

---

# Testing

Recommended tools:

- Postman
- Insomnia
- VS Code REST Client
- Axios
- Fetch

Suggested testing order:

```text
GET /
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
POST /api/auctions
GET /api/auctions/all-auctions
GET /api/auctions/:id
POST /api/bids/:auctionId
GET /api/bids/:auctionId
GET /api/bids/my-bids
PATCH /api/auctions/:auctionId
PATCH /api/auctions/:auctionId/end
DELETE /api/auctions/:auctionId
```

---

# Security

- Passwords are hashed with bcrypt.
- JWT authentication is used for protected resources.
- Authentication tokens are stored in HTTP-only cookies.
- Production cookies use secure settings.
- CORS is explicitly configured.
- Protected routes use authentication middleware.
- Auction ownership is checked server-side.
- Users cannot bid on their own auctions.
- Bid amounts are validated server-side.
- Environment variables are validated with Zod.
- Secrets should never be committed to Git.

---

# Deployment

The backend is designed to run as a Node.js Web Service.

For Render:

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
```

Production environment variables:

```env
PORT=10000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
CLIENT_URL=your_frontend_url
```

The backend is already deployed. Replace `YOUR_RENDER_URL` above with the actual live API URL.

---

# Future Improvements

- Pagination
- Search and filtering
- Image upload/storage
- Swagger/OpenAPI documentation
- Automated tests
- Rate limiting
- Admin APIs
- Email notifications
- Payment integration
- Docker
- CI/CD
- Monitoring and structured logging
- Production frontend

---

# Author

**Yash Kokate**

GitHub: https://github.com/yashkokate16

---

## BidArena

**A real-time auction backend built with Node.js, Express.js, MongoDB, JWT, and Socket.IO.**
