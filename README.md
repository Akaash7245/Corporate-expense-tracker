# Spendora - Corporate Expense Management Platform

Spendora is a modern, enterprise-grade corporate expense tracking and management platform. It streamlines the entire lifecycle of corporate expenses, from employee submission and receipt scanning (OCR) to managerial approval and finance team analytics.

## ✨ Core Features

* **Role-Based Workflows**: Tailored experiences and permissions for Employees, Managers, Finance Teams, and Admins.
* **Smart OCR Receipt Parsing**: Automatically extracts total amount, merchant name, and date from uploaded receipts/bills using Tesseract.js.
* **Automated Data Locking**: Once a receipt is scanned and verified, critical fields (Amount, Merchant, Date) are locked to prevent tampering, ensuring data integrity.
* **Fraud Detection AI**: Automated flagging of suspicious expenses (e.g., duplicate submissions, policy violations, rounded numbers).
* **Real-Time Analytics Dashboard**: Live charts and KPIs detailing monthly spend, category breakdowns, and department budgets.
* **Notification System**: In-app notifications alerting users and managers about expense approvals, rejections, and OCR review requests.
* **Dark & Light Mode**: Premium UI with seamless toggling between an ultra-modern Dark Mode and a crisp, corporate Light Mode.

---

## 🛠️ Technology Stack

**Frontend (Client)**
* **React 18** (Vite)
* **React Router DOM** (Routing & Navigation)
* **Recharts** (Data Visualization & Dashboards)
* **Lucide React** (Modern Iconography)
* **Axios** (API Communication)
* **Tesseract.js** (Client-side Optical Character Recognition for receipts)
* **Vanilla CSS** (Custom, highly optimized CSS variable-based design system)

**Backend (Server)**
* **Node.js & Express.js**
* **Sequelize (ORM)** with **SQLite** database (Easily swappable to PostgreSQL/MySQL for production scale).
* **JWT (JSON Web Tokens)** & **Bcrypt.js** (Authentication & Security)
* **Socket.io** (Real-time notifications and live dashboard updates)
* **Multer** (Handling file uploads for receipts)

---

## 🚀 Getting Started (Local Development)

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### 1. Clone the Repository
Ensure you are in the root directory: `Corporate-expense-tracker`

### 2. Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `server` directory and add the following:
   ```env
   PORT=5000
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```
4. Seed the database with realistic test data: `npm run seed`
   *(Note: This creates a `database.sqlite` file pre-populated with users and expenses).*
5. Start the backend server: `npm run dev` (Runs on `http://localhost:5000`)

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `client` directory and add the following:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend development server: `npm run dev` (Runs on `http://localhost:5173`)

### 4. Test Accounts
You can log in using any of the seeded demo accounts:
* **Admin**: `admin@company.com` / `Admin123!`
* **Finance**: `finance@company.com` / `Finance123!`
* **Manager**: `manager@company.com` / `Manager123!`
* **Employee**: `john@company.com` / `Employee123!`

---

## 📝 Developer Notes & Architecture

### 1. Database Schema (Sequelize)
* `User`: Stores employees, their roles, and `managerId` (self-referencing foreign key to build the organizational hierarchy).
* `Expense`: Stores expense data, status (`pending`, `approved`, `rejected`), amounts, and an optional `fraudScore`.
* `Category`: Defines available expense categories, their UI colors, and budget limits.
* `Notification`: Stores user-specific alerts triggered by backend events.

### 2. The OCR Engine (`NewExpensePage.jsx`)
* Tesseract.js runs entirely in the browser to process images and extract text.
* The script uses Regex patterns to hunt for Currency formats (e.g., `$100.00`, `₹450`) and Dates.
* **Fallback Logic**: If the OCR fails to extract critical data, the form allows the user to submit an "OCR Review Request". This triggers a specialized backend route that alerts Admins/Managers to manually review the attached receipt.

### 3. Theming System (`index.css`)
* The entire application is styled using a robust CSS Variable system (`--color-primary`, `--bg-primary`, etc.).
* Dark Mode is the default. Light mode is achieved via a `.light-mode` class appended to the `<body>` tag, which overrides the root CSS variables with a secondary palette (resembling modern SaaS tools like Stripe and Linear).

### 4. Real-time Architecture
* `Socket.io` is initialized in `server/server.js` and attached to the Express app.
* When critical database mutations occur (e.g., an expense is approved in `expense.routes.js`), the backend emits an event (`expense:updated`).
* The React frontend listens for these events and automatically refetches dashboard data, ensuring managers and finance teams see live, real-time metrics without refreshing the page.

---
*Developed by the Antigravity Team*
