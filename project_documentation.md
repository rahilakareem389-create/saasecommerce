# SaaS E-Commerce Platform - Project Documentation

## 1. Project Overview
This project is a full-stack Software-as-a-Service (SaaS) E-Commerce platform. It features a modern storefront for customers, a dedicated user dashboard for tracking orders, and a comprehensive Admin Dashboard for managing the entire business (products, inventory, sales, coupons, and users).

## 2. Technology Stack
The project is built using the **MERN Stack** with modern build tools:
- **Frontend:** React.js (built with Vite for fast performance), Tailwind CSS for styling, and Context API for state management.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (Cloud Database) with Mongoose ODM.
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs for secure password hashing.
- **Additional Tools:** Nodemailer for email notifications, Socket.io for real-time events.

## 3. Project Architecture
The project is divided into two decoupled architectures to ensure scalability:
- **`/frontend`**: A Single Page Application (SPA) that consumes the backend REST APIs.
- **`/backend`**: A RESTful API server that connects to the database, handles business logic, and manages authentication.

## 4. Key Features Implemented

### Customer Facing
* **Storefront:** Browse products by categories, view product details, and read reviews.
* **Shopping Cart & Checkout:** Add items to cart, apply discount coupons, and place orders.
* **Wishlist:** Save favorite products for later.
* **User Dashboard:** Customers can view their order history, manage their profile, and leave product reviews.

### Admin Dashboard (CMS)
* **Inventory & Product Management:** Full CRUD (Create, Read, Update, Delete) operations for products and categories.
* **Order Management:** View incoming orders, update order statuses (Pending, Shipped, Delivered).
* **Customer Management:** View registered users, block/unblock users, and track individual user spending.
* **Marketing:** Create and manage discount coupons with expiry dates and usage limits.
* **Analytics:** Real-time KPI tracking for Total Revenue, Total Orders, and Active Products.

## 5. Execution & Deployment Strategy

The project was executed and deployed using a multi-step cloud deployment strategy via **GitHub** and **Vercel**.

### Step 1: Code Optimization for Serverless
- **Backend:** Vercel relies on Serverless Functions. The `server.js` was modified to export the Express `app` (`module.exports = app`) instead of just listening on a local port. A `vercel.json` file was created to route all incoming API requests to the Express server.
- **Frontend:** A `vercel.json` file was added to the frontend with a `"rewrites"` rule (`/(.*) -> /index.html`). This ensures that React Router handles all page navigation without throwing `404 Not Found` errors.

### Step 2: Version Control
- A `.gitignore` file was initialized to keep the repository clean.
- The entire codebase was committed and pushed to a remote GitHub repository (`saasecommerce`).

### Step 3: Backend Deployment & Database Configuration
- The `backend` directory was deployed as an independent project on Vercel.
- **Environment Variables** (`MONGO_URI`, `JWT_SECRET`, `EMAIL_USER`, etc.) were securely added to the Vercel dashboard.
- **Database Access:** MongoDB Atlas was configured to allow cloud connections by setting the IP Access List to `0.0.0.0/0` (Allow Access from Anywhere) and updating the Database User credentials.

### Step 4: Frontend Integration & Deployment
- The hardcoded local API endpoints (`http://localhost:5000`) in the React code were globally replaced with the live Vercel Backend URL.
- The updated code was pushed to GitHub.
- The `frontend` directory was deployed as a separate Vercel project, creating the final user-facing live website.

## 6. Challenges Overcome
* **Database Timeout (500 Error):** Initially, the backend timed out while connecting to MongoDB due to strict IP whitelisting. This was resolved by opening MongoDB Atlas network access to Vercel's dynamic cloud IPs.
* **Client-Side Routing (404 Error):** Direct navigation to frontend routes (like `/products`) resulted in 404s. This was fixed by implementing Vercel rewrite rules for the SPA.
