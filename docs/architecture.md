# Architecture & Design Documentation

ExpenseFlow is built as a three-tier monorepo consisting of:
1. **Frontend Client**: A modern, single-page React app using Vite and Chart.js.
2. **Backend Server**: A Node.js + Express REST API using Socket.io for WebSockets and Sequelize ORM with SQLite.
3. **ML Service**: A Python FastAPI server providing machine learning utilities like receipt text extraction (OCR) and anomaly/fraud detection.

---

## Directory Layout

```
C:\Users\vuggi\Downloads\Corporate-expense-tracker-main\
├── src/
│   ├── client/                  # Frontend Vite React app
│   ├── server/                  # Backend Node.js Express server
│   └── ml-service/              # Python FastAPI machine learning server
├── data/
│   ├── database.sqlite          # SQLite database file
│   └── seed.js                  # Database seeding script (adjusted paths)
├── uploads/                     # Uploaded files (receipt images, PDFs)
├── scripts/
│   └── run_app.bat              # Setup and execution batch script (adjusted paths)
├── docs/
│   └── architecture.md          # Architecture and API documentation
├── notebooks/
│   └── anomaly_detection.ipynb  # Jupyter notebook demonstrating ML API usage
├── .github/
│   └── workflows/
│       └── ci.yml               # GitHub Actions CI/CD pipeline configuration
├── .gitignore                   # Consolidated root-level Git ignore settings
├── .env.example                 # Consolidated environment variables template
├── package.json                 # Monorepo setup with workspaces and run scripts
├── LICENSE                      # MIT Open Source License
└── README.md                    # Updated beautiful project documentation
```

---

## Data Flow Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   React.js UI   │◄───►│  Node.js + Express│◄───►│  Python FastAPI  │
│   (Vite)        │     │  REST + Socket.io │     │  ML Microservice │
│   Chart.js      │     │  Port: 5000       │     │  Port: 8000      │
│   Port: 5173    │     │                   │     │                  │
└─────────────────┘     └──────┬───────────┘     └──────────────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
              ┌─────┴──┐ ┌────┴───┐ ┌────┴────┐
              │ SQLite  │ │ Redis  │ │ Uploads │
              │   DB    │ │(cache) │ │ (files) │
              └────────┘ └────────┘ └─────────┘
```

---

## Database Models

- **User**: Represents corporate roles (Employee, Manager, Finance, Admin) containing firstName, lastName, email, password, and managerId (for reporting structures).
- **Expense**: Stores expense reports (amount, category, description, status: pending/approved/rejected, supporting files, anomaly score).
- **Category**: Defines department budgets (Travel, Food, Office Supplies, etc.) and limits.
- **Approval**: Logs history of managers who approved/rejected specific expenses.
- **Notification**: Manages real-time alert logs delivered to users.

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new user account
- `POST /api/auth/login` - Authenticate user credentials and return JWT token
- `GET /api/auth/me` - Fetch details of the currently logged-in user

### Expenses
- `GET /api/expenses` - Retrieve list of expenses (automatically filtered based on user role)
- `POST /api/expenses` - Submit a new expense (with receipt upload link)
- `PATCH /api/expenses/:id/status` - Approve, reject, or mark expense as reimbursed (Managers/Finance)
- `GET /api/expenses/stats` - Fetch aggregated analytics for Chart.js dashboards

### Machine Learning Service (FastAPI)
- `POST /api/ocr/extract` - Performs optical character recognition on uploaded receipts
- `POST /api/anomaly/detect` - Scores expenses against historical trends to flag suspicious activities
