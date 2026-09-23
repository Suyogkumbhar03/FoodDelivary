# PetPooja — Everyday Indian Food Delivery Platform 🍛

> *"Pehle pet pooja, phir kaam dooja"* — Authentic, high-octane Indian food delivery built with the MERN stack.

---

## 🌟 Overview

**PetPooja** is a mass-market, Indian-first food delivery application designed to deliver an engaging, vibrant, and intuitive dining experience. The platform features curated culinary outlets ranging from **Heritage Fine Dining & Royal Darbars** to **Legendary Street Food Stalls & Chaat Corners**.

Built with a responsive, modern design system powered by **React**, **Tailwind CSS**, **Zustand**, **Node.js**, **Express**, and **MongoDB**.

---

## ✨ Key Features

- **Desi Food Experience & Curated Outlets**:
  - Filter by place types: *Heritage Fine Dining*, *Grand Hotels*, *Street Stalls*, *Pure Veg Udupi*, *Midnight Dhabas*, and *Mithai Darbars*.
  - Browse dishes categorized by authentic Indian food lingo (*Most Ordered*, *Royal Biryanis*, *Chaat & Snacks*, etc.).

- **Guest Browsing & 15-Minute Session Expiry**:
  - Open and explore the app freely without any mandatory initial login modal.
  - User sessions automatically expire 15 minutes after login/inactivity to ensure account security.

- **Mandatory Authentication Guard for Food Purchases**:
  - Guests can explore menus and customize their cart.
  - Placing an order or proceeding to checkout enforces mandatory user authentication before payment.

- **Address & Cart Management**:
  - Save and persist delivery locations with instant validation.
  - Dynamic item quantity adjustment, custom cooking notes, and automated GST/packaging bill calculations.

- **Production-Ready Deployment Configurations**:
  - SPA Client-Side Routing configured for **Vercel** (`vercel.json`).
  - RESTful Backend API configured for **Render** deployment with CORS and MongoDB Atlas support.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (built with Vite)
- **Styling**: Tailwind CSS & Vanilla CSS Design System
- **State Management**: Zustand (`useCraveStore.js`)
- **Icons & Animations**: Framer Motion & Google Material Symbols

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS
- **Validation**: Express Validator

---

## 📁 Project Structure

```
Food Delivary/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Header, Footer, CartDrawer, AuthModal, CheckoutView, etc.
│   │   ├── store/              # Zustand state management (useCraveStore.js)
│   │   ├── services/           # Axios API client
│   │   └── data/               # Mock fallback food catalog data
│   ├── vercel.json             # Vercel SPA routing rewrite rules
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── server/                     # Node.js & Express Backend API
│   ├── config/                 # MongoDB database connection (db.js)
│   ├── controllers/            # Auth, Restaurant, and Order logic
│   ├── models/                 # Mongoose schemas (User, Restaurant, Order)
│   ├── routes/                 # Express API endpoints
│   ├── seed.js                 # Seeder script for authentic Indian restaurants
│   ├── .env.example            # Backend environment variable template
│   └── server.js               # Entry point
│
├── .gitignore                  # Excludes node_modules, build output & secret env files
└── README.md
```

---

## ⚙️ Local Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI

### 1. Clone the Repository
```bash
git clone https://github.com/Suyogkumbhar03/FoodDelivary.git
cd FoodDelivary
```

### 2. Backend Setup
```bash
cd server
npm install

# Copy environment template
cp .env.example .env

# Seed initial restaurant & menu database
npm run seed

# Start development server (runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Copy environment template
cp .env.example .env

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 🔐 Environment Variables

### `client/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

### `server/.env`
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/petpooja_food_db
JWT_SECRET=super_secret_petpooja_jwt_key_2026
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Deployment Instructions

### Deploy Backend on **Render**
1. Create a new **Web Service** on Render and select your GitHub repository.
2. Set Root Directory to `server`.
3. Set Build Command to `npm install` and Start Command to `npm start`.
4. Add environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `CLIENT_URL`.

### Deploy Frontend on **Vercel**
1. Create a new project on Vercel and import your repository.
2. Set Root Directory to `client`.
3. Set Environment Variable: `VITE_API_URL=https://<your-render-backend-url>/api`.
4. Deploy! `client/vercel.json` will automatically handle SPA client-side route rewrites.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more details.
