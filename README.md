# FoodShare – Community Food Donation & Request Platform

## Overview
FoodShare is a community-driven platform designed to reduce food waste and fight hunger by connecting people who have surplus food with those in need. The platform enables users to post food donations or requests, browse nearby offers and needs, claim or fulfill posts, and track pickups—all with a simple, intuitive interface and real-time status flows.

## Scenario
Surplus food often goes to waste while others go hungry. Neighbors struggle to coordinate pickups and donations in real time. FoodShare solves this by providing a community hub for food sharing and coordination.

## 🎯 Objective
Build a community hub where users can:
- Post food donations or requests
- Browse nearby offers/needs
- Claim or fulfill posts
- Track pickups
- Use simple mapping and status flows

## 👥 User Role: user
- All users can post donations or requests
- Each post has an owner and a status flow

## 🔐 Authentication & Authorization
- **Login required** to post or claim donations/requests
- **Public browsing** of posts allowed without login

## 🧱 Core Functional Modules

### 1. Post Donation / Request
- Form includes:
  - Type (Donate or Request)
  - Description
  - Quantity
  - Pickup Location (text or map pin)
  - Expiry Date

### 2. Public Feed & Map View
- List & map pins of all active posts
- Filters:
  - Type
  - Expiry soon
  - Distance (mocked)

### 3. Claim & Confirm Flow
- "Claim" button on donation posts
- Owner approves claim → status moves Claimed → Picked Up

### 4. Status Tracking
- Timeline on each post:
  - Posted → Claimed → Picked Up → Completed
- Auto-expire after Expiry Date → Expired status

### 5. Notifications
- In-app/reminders when your claim is approved
- Warning near expiry: "Your request expires in 1 day"

### 6. History & Reputation
- User profile shows:
  - Total donations made/received
  - Ratings (1–5 stars) from claimers or donors
  - Users can rate each other post-pickup

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd FoodConnect-main
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or for client/server separately
   cd client && npm install
   cd ../server && npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   # or run client and server separately as needed
   ```
4. **Open the app:**
   - Visit [http://localhost:5001](http://localhost:5001) in your browser.

## 🛠️ Tech Stack
- React (Frontend)
- Node.js + Express (Backend)
- TypeScript
- React Query, Wouter, Lucide Icons, and more

## 📂 Project Structure
- `client/` – Frontend React app
- `server/` – Backend API
- `shared/` – Shared types and schema
- `uploads/` – Uploaded food images

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License
[MIT](LICENSE)

---
FoodShare – Building stronger, more caring communities through food sharing.
