# ExpenseFlow — Real-Time Corporate Expense Tracking & Auditing System

ExpenseFlow simplifies organization-wide expenditure control by enabling employees to submit claims with automatic ML-powered anomaly scoring, while managers approve claims in real-time via WebSockets.

---

## 🎯 Problem Statement

Traditional expense reporting is slow, manual, and prone to policy violations or fraud. 
* **Employees** get frustrated uploading receipts and waiting weeks for manual reviews and updates.
* **Managers** are overwhelmed with piles of claims and lack the immediate context to make quick decisions.
* **Finance Teams** spend hours auditing line items, manually comparing them against policy guidelines, and looking for duplicate or fraudulent claims.

**ExpenseFlow** solves this by providing:
1. **Real-time Approval Workflows**: Instant synchronization between employees and managers via WebSockets (Socket.io).
2. **Automated Auditing**: Machine learning models automatically extract receipt text (OCR) and calculate a fraud probability score prior to manager review.
3. **Clear Analytics**: Finance dashboards visualize budget utilizations and monthly spending patterns interactively.

---

## 🛠️ Tech Stack

| Component | Technologies Used |
|---|---|
| **Frontend UI** | React 18, Vite, Chart.js, react-chartjs-2, Socket.io-client |
| **Backend API** | Node.js, Express, Socket.io, Sequelize ORM, SQLite |
| **ML Microservice** | Python 3.10, FastAPI, Uvicorn, OCR engines, Scikit-learn |
| **Deployment / CI** | NPM Workspaces, Concurrently, GitHub Actions, Docker |

---

## 🏗️ Architecture Overview

The system is designed as a three-tier monorepo:

```
┌──────────────────┐      ┌───────────────────┐      ┌───────────────────┐
│   React.js UI    │◄────►│  Node.js Express  │◄────►│  Python FastAPI   │
│   (Vite App)     │      │   REST + Socket   │      │  ML Microservice  │
│   Port: 5173     │      │    Port: 5000     │      │    Port: 8000     │
└──────────────────┘      └─────────┬─────────┘      └───────────────────┘
                                    │
                         ┌──────────┼──────────┐
                         │          │          │
                   ┌─────┴──┐ ┌────┴───┐ ┌────┴────┐
                   │ SQLite  │ │ Redis  │ │ Uploads │
                   │   DB    │ │(cache) │ │ (files) │
                   └────────┘ └────────┘ └─────────┘
```

---

## ✨ Features

* **Real-time Notifications**: Immediate toast notifications and dashboard badge updates for managers upon new submissions, and for employees upon approval or rejection.
* **ML Anomaly Detection**: Submissions are scanned and scored against historical norms. High scores flag claims as suspicious, notifying managers immediately.
* **Receipt Text Parsing**: Automatically extracts text, merchants, dates, and amounts from receipts to speed up claim creation.
* **Role-Based Dashboards**: Fine-grained access control tailored for Admins, Finance Managers, Team Managers, and Employees.
* **Interactive Chart.js Visualizations**: Breakdowns by category budgets, status distributions, team spending, and monthly trend reports.

---

## ⚙️ Installation & Setup Instructions

### Prerequisites
* **Node.js** v18+
* **Python** v3.10+

### 1. Clone & Configure Environments
```bash
git clone https://github.com/Akaash7245/Corporate-expense-tracker.git
cd Corporate-expense-tracker
cp .env.example src/server/.env
```

### 2. Install Workspace Dependencies
Installs Node workspaces dependencies and Python ML libraries:
```bash
npm run install:all
```

### 3. Initialize & Seed Database
Recreates the SQLite database and populates it with categories, demo users, and mock expenses:
```bash
npm run seed
```

---

## 🚦 Usage Examples

To launch the React client, Express server, and Python ML microservice concurrently:
```bash
npm run start
```
*Windows users can also double-click `run_app.bat` at the repository root.*

### Test Accounts
You can log in to the client at `http://localhost:5173` using the following seeded roles:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@company.com` | `Admin123!` |
| **Finance** | `finance@company.com` | `Finance123!` |
| **Manager** | `manager@company.com` | `Manager123!` |
| **Employee** | `john@company.com` | `Employee123!` |

---

## 🧪 Testing

* **Workspace Code Checks**: Run linting and component tests across Node workspaces:
  ```bash
  npm run test
  ```
* **Python ML Code Verification**: Runs PEP8 style validation on Python services using:
  ```bash
  flake8 src/ml-service
  ```
* **CI/CD Integration**: A GitHub Actions workflow is configured in `.github/workflows/ci.yml` that validates dependencies, runs builds, and performs syntax checks on every push or pull request.

---

## 💡 Challenges & Learnings

### 1. Real-time Synchronization
* **Challenge**: Keeping state synchronized between client dashboards and the server database without refreshing or polling.
* **Solution**: Implemented custom Socket.io rooms mapped to user departments and managers. Managers join their team's channel to receive immediate alerts upon employee uploads.

### 2. SQLite Concurrency Control
* **Challenge**: SQLite locks the database file when executing write queries, causing timeouts during seed creation or bulk manager approvals.
* **Solution**: Configured database connection pooling and optimized transactions in Sequelize ORM to complete lock times in milliseconds.

### 3. ML Model Decoupling
* **Challenge**: The Node.js Express server is highly performant for WebSockets, but poor for heavy mathematical ML models.
* **Solution**: Decoupled the ML operations into a FastAPI microservice. The Express server uploads receipts, saves them to disk, and sends a REST message to FastAPI which analyzes the file asynchronously and returns the results.

---

## 🔮 Future Improvements

1. **Redis Cache Layer**: Integrate Redis to cache database requests for budget tracking and reduce query counts on SQLite.
2. **PostgreSQL Migration**: Move from SQLite to PostgreSQL for production environments to allow true concurrent read/write transactions.
3. **Advanced LLM OCR**: Upgrade the text parser from static Tesseract OCR to a lightweight LLM model to scan and extract structured tables from receipts accurately.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
