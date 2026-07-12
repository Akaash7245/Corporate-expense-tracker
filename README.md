# ExpenseFlow — Real-Time Expense Tracking System

A full-stack, real-time expense tracking platform for corporate organizations. Employees submit expenses through a premium React dashboard, managers approve/reject in real-time via WebSocket, and finance teams monitor budgets with interactive Chart.js visualizations.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![FastAPI](https://img.shields.io/badge/Python-FastAPI-teal) ![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-purple)

---

## 📁 Restructured Repository Directory Layout

We have restructured the repository into a clean, professional, and standard monorepo structure:

```
C:\Users\vuggi\Downloads\Corporate-expense-tracker-main\
├── src/                         # main source code
│   ├── client/                  # Frontend Vite React app
│   ├── server/                  # Backend Node.js Express server
│   └── ml-service/              # Python FastAPI machine learning server
├── data/                        # SQLite database and seed configuration
│   ├── database.sqlite          # Local database file (git ignored)
│   └── seed.js                  # Database seeder script
├── uploads/                     # Uploaded receipts storage (git ignored)
├── scripts/                     # Operational scripts
│   └── run_app.bat              # Original setup & debug mode launcher
├── docs/                        # Project architecture & route guidelines
│   └── architecture.md          # Architecture and endpoints documentation
├── notebooks/                   # Jupyter notebooks for ML / data science
│   └── anomaly_detection.ipynb  # Interactive API caller & anomaly detection demo
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD workflows
├── .gitignore                   # Consolidated root-level Git ignore settings
├── .env.example                 # Consolidated environment variables example
├── LICENSE                      # MIT Open Source License
├── package.json                 # Monorepo setup with workspaces and run scripts
└── README.md                    # This readme file
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **Python** v3.10+ (for Machine Learning service)

---

### Running the Services

We have set up **npm workspaces** and configured run scripts in the root-level `package.json` to make development extremely simple.

#### 1. Configure the Environment
Copy the example environment variable file to the backend server directory:
```bash
cp .env.example src/server/.env
```

#### 2. Install All Dependencies (Node + Python ML)
To install all dependencies across the client, server, and machine learning services:
```bash
npm run install:all
```

#### 3. Seed the Database
To reset and seed the database with mock roles (60 expenses, 8 users):
```bash
npm run seed
```

#### 4. Run the Complete Project
To run the React frontend, Node backend, and FastAPI ML service concurrently with a single command:
```bash
npm run start
```
*Alternatively, you can double-click `run_app.bat` at the root directory of the project to run it in Windows debug mode.*

---

## 👥 Demo Accounts

The database seeder configures the following demo accounts for testing:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@company.com` | `Admin123!` |
| **Finance** | `finance@company.com` | `Finance123!` |
| **Manager** | `manager@company.com` | `Manager123!` |
| **Employee** | `john@company.com` | `Employee123!` |

---

## 📡 API Architecture & Documentation

For complete detailed endpoints, database schemas, and data flow descriptions, please see the [architecture.md](file:///C:/Users/vuggi/Downloads/Corporate-expense-tracker-main/docs/architecture.md) documentation under the `docs/` folder.
