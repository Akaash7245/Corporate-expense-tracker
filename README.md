# ExpenseFlow — Real-Time Expense Tracking System

A full-stack, real-time expense tracking platform for corporate organizations. Employees submit expenses through a premium React dashboard, managers approve/reject in real-time via WebSocket, and finance teams monitor budgets with interactive Chart.js visualizations.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-Express-green) ![FastAPI](https://img.shields.io/badge/Python-FastAPI-teal) ![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-purple)

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   React.js UI   │◄───►│  Node.js + Express│◄───►│  Python FastAPI  │
│   (Vite)        │     │  REST + Socket.io │     │  ML Microservice │
│   Chart.js      │     │  GraphQL          │     │  OCR + Anomaly   │
│   Port: 5173    │     │  Port: 5000       │     │  Port: 8000      │
└─────────────────┘     └──────┬───────────┘     └──────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
              ┌─────┴──┐ ┌────┴───┐ ┌────┴────┐
              │ SQLite  │ │ Redis  │ │ Uploads │
              │   DB    │ │(cache) │ │ (files) │
              └────────┘ └────────┘ └─────────┘
```

## Features

### For Employees
- ✅ Submit expenses with receipt upload
- ✅ Track expense status in real-time
- ✅ View personal expense history with filters
- ✅ Receive instant notifications on approvals/rejections

### For Managers
- ✅ Review and approve/reject team expenses
- ✅ Bulk approval actions
- ✅ Real-time alerts for new submissions
- ✅ Team spending overview

### For Finance
- ✅ Organization-wide expense analytics
- ✅ Budget utilization monitoring
- ✅ Category breakdown reports
- ✅ Monthly trend analysis with Chart.js

### System Features
- 🔐 JWT Authentication with role-based access control
- 📡 Real-time updates via Socket.io (WebSocket)
- 📊 5 interactive Chart.js visualizations
- 🤖 ML-powered anomaly detection and fraud scoring (FastAPI)
- 📸 Receipt upload with image preview
- 🔔 Real-time notification system
- 🌙 Premium dark theme with glassmorphism design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Charts | Chart.js + react-chartjs-2 |
| Real-time | Socket.io |
| Backend API | Node.js + Express |
| ML Service | Python FastAPI |
| Database | SQLite (Sequelize ORM) |
| Auth | JWT + bcrypt |
| File Upload | Multer |

## Quick Start

### Prerequisites
- Node.js 18+ (installed via fnm)
- Python 3.10+ (for ML microservice)

### 1. Start the Backend Server

```bash
cd server
npm install
npm run seed    # Seeds demo data (60 expenses, 8 users)
npm run dev     # Starts on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd client
npm install
npm run dev     # Starts on http://localhost:5173
```

### 3. Start the ML Microservice (Optional)

```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 4. Open in Browser

Navigate to `http://localhost:5173`

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@company.com | Admin123! |
| **Finance** | finance@company.com | Finance123! |
| **Manager** | manager@company.com | Manager123! |
| **Employee** | john@company.com | Employee123! |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/expenses | List expenses (filtered by role) |
| GET | /api/expenses/stats | Dashboard statistics |
| GET | /api/expenses/:id | Get single expense |
| POST | /api/expenses | Create expense |
| PUT | /api/expenses/:id | Update expense |
| PATCH | /api/expenses/:id/status | Approve/reject/reimburse |
| DELETE | /api/expenses/:id | Delete expense |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/categories | List categories |
| GET | /api/notifications | User notifications |
| POST | /api/upload | Upload receipt |
| GET | /api/users | List users (admin) |

### ML Service (Port 8000)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/ocr/extract | Extract receipt data |
| POST | /api/anomaly/detect | Detect expense anomalies |
| POST | /api/anomaly/fraud-score | Calculate fraud score |

## Project Structure

```
Project/
├── client/                    # React.js frontend (Vite)
│   ├── src/
│   │   ├── components/       # UI components
│   │   │   ├── charts/       # Chart.js visualizations
│   │   │   └── layout/       # Sidebar, Header
│   │   ├── context/          # Auth, Toast contexts
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   └── index.css         # Design system
│   └── package.json
├── server/                    # Node.js + Express backend
│   ├── config/               # Database config
│   ├── middleware/            # JWT auth, RBAC
│   ├── models/               # Sequelize models
│   ├── routes/               # API routes
│   ├── socket/               # Socket.io handlers
│   ├── server.js             # Entry point
│   ├── seed.js               # Database seeder
│   └── package.json
├── ml-service/               # Python FastAPI
│   ├── app/
│   │   ├── routers/          # OCR, Anomaly endpoints
│   │   └── main.py           # FastAPI entry
│   └── requirements.txt
└── uploads/                   # Receipt storage
```

## License

MIT
