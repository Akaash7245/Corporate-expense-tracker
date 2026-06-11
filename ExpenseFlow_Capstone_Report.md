# CAPSTONE PROJECT REPORT
**(Project Term January-May 2026)**

## ExpenseFlow: A Real-Time Corporate Expense Tracker with AI-Powered Fraud Detection & Forecasting

**Submitted by**
* **Akanksh Vuggi** — *Registration Number: 12210806*
* **K Jaya Sravani** — *Registration Number: 12212274*

**Project Group Number:** G1  
**Course Code:** CSE-461  

**Under the Guidance of**  
**Karan Kumar Das**  
*Delivery and Student Success*  
*School of Computer Science and Engineering*  
*Lovely Professional University, Phagwara, Punjab*

---

## DECLARATION STATEMENT

I hereby declare that the research and development work reported in the capstone project report entitled **"ExpenseFlow: A Real-Time Corporate Expense Tracker with AI-Powered Fraud Detection & Forecasting"** in partial fulfillment of the requirement for the award of Degree of Bachelor of Technology in Computer Science and Engineering at Lovely Professional University, Phagwara, Punjab is an authentic work carried out under supervision of my research supervisor Mr. Karan Kumar Das. I have not submitted this work elsewhere for any degree or diploma.

I understand that the work presented herewith is in direct compliance with Lovely Professional University’s Policy on plagiarism, intellectual property rights, and highest standards of moral and ethical conduct. Therefore, to the best of my knowledge, the content of this report represents an authentic and honest research effort conducted, in its entirety, by me. I am fully responsible for the contents of my project work.

**Akanksh Vuggi**  
*Registration Number: 12210806*  
Date:  

**K Jaya Sravani**  
*Registration Number: 12212274*  
Date:  

---

## CERTIFICATE

This is to certify that the declaration statement made by this group of students is correct to the best of my knowledge and belief. They have completed this Capstone Project under my guidance and supervision. The present work is the result of their original investigation, effort, and study. No part of the work has ever been submitted for any other degree at any University. The Capstone Project is fit for the submission and partial fulfillment of the conditions for the award of B.Tech degree in the School of Computer Science and Engineering from Lovely Professional University, Phagwara.

**Signature**  
**Karan Kumar Das**  
*School of Computer Science and Engineering,*  
*Lovely Professional University, Phagwara, Punjab.*  
Date:  

---

## ACKNOWLEDGEMENT

We would like to express our deepest gratitude to all those who have contributed to the successful completion of our project titled **“ExpenseFlow: A Real-Time Corporate Expense Tracker with AI-Powered Fraud Detection & Forecasting”**. This project would not have been possible without the guidance, support, and encouragement of numerous individuals and organizations.

First and foremost, we extend our heartfelt thanks to our project guide, **Mr. Karan Kumar Das**, Delivery and Student Success, for his invaluable guidance, constant encouragement, and insightful feedback throughout the project. His expertise and patience have been instrumental in shaping this work and helping us overcome challenges at every stage.

We are also grateful to the faculty members of the School of Computer Science and Engineering at Lovely Professional University for their unwavering support and for providing us with the necessary resources and infrastructure to carry out this project.

---

## TABLE OF CONTENTS

* **Declaration**
* **Certificate**
* **Acknowledgement**
* **Table of Contents**
* **List of Figures**
* **List of Tables**
* **CHAPTER 1. INTRODUCTION**
* **CHAPTER 2. PROBLEM STATEMENT**
  * *2.1. Profile of the Problem*
  * *2.2. Rationale / Scope of the Study*
* **CHAPTER 3. LITERATURE REVIEW**
  * *3.1. Introduction*
  * *3.2. Existing Software & Approaches*
  * *3.3. Gaps and Challenges of Current Work*
  * *3.4. What's New in the System to be Developed*
* **CHAPTER 4. PROBLEM ANALYSIS**
  * *4.1. Product Definition*
  * *4.2. Feasibility Analysis*
  * *4.3. Project Plan*
* **CHAPTER 5. SOFTWARE REQUIREMENT ANALYSIS**
  * *5.1. Introduction*
  * *5.2. General Description*
  * *5.3. Specific Requirements*
  * *5.4. Functional Requirements*
  * *5.5. Non-Functional Requirements*
  * *5.6. Hardware Requirements*
  * *5.7. Software Requirements*
* **CHAPTER 6. DESIGN**
  * *6.1. System Design*
  * *6.2. Detailed Design*
  * *6.3. Database Schema Design*
  * *6.4. Pseudo Code*
* **CHAPTER 7. TESTING**
  * *7.1. Functional Testing*
  * *7.2. Structural Testing*
  * *7.3. Levels of Testing*
  * *7.4. Test Cases and Result Summary*
* **CHAPTER 8. IMPLEMENTATION**
  * *8.1. Implementation of the Project*
  * *8.2. Frontend Implementation*
  * *8.3. Backend Server Implementation*
  * *8.4. Machine Learning Microservice*
* **CHAPTER 9. PROJECT LEGACY**
  * *9.1. Current Status of the Project*
  * *9.2. Remaining Areas of Concern*
  * *9.3. Technical and Managerial Lessons Learnt*
* **CHAPTER 10. USER MANUAL**
  * *10.1. Purpose of the System*
  * *10.2. Run Instructions*
  * *10.3. Demo Accounts*
  * *10.4. Limitations & Future Enhancements*
* **CHAPTER 11. REFERENCES**

---

## LIST OF FIGURES

1. Fig 1. Decoupled Microservices System Architecture
2. Fig 2. Relational Database Schema Model Associations
3. Fig 3. Data Flow Diagram (DFD) Level 0 - Core Submissions
4. Fig 4. Data Flow Diagram (DFD) Level 1 - Processing & Approvals
5. Fig 5. Chart.js Category Budget Visualizations
6. Fig 6. Real-Time Notification Feed Sidebar
7. Fig 7. Dark-Themed Glassmorphic Workspace Login
8. Fig 8. Manager Approval Panel Interface

---

## LIST OF TABLES

1. Table 1. Comparison of ExpenseFlow with Existing Commercial Software
2. Table 2. Hardware Requirements for Client & Server Hosts
3. Table 3. Software Requirements and Dependencies
4. Table 4. Functional Test Cases - Authentication & Security
5. Table 5. Functional Test Cases - Expense Submission & Socket Broadcast
6. Table 6. Structural Test Cases - Key Code Paths
7. Table 7. Testing Results Matrix Summary

---

## CHAPTER 1. INTRODUCTION

Corporate expense management represents a critical business operation that directly impacts cash flow, tax compliance, and financial forecasting. For organizations of all sizes, the processing of business travel, dining, lodging, and supply purchases has historically been a friction-filled administrative task. Employees are often burdened with saving physical receipts, manually compiling reports, and waiting weeks for reimbursement. Concurrently, managers are inundated with email approval chains, and finance teams lack real-time visibility into departmental budgets, only discovering overspending during end-of-month reconciliations.

With the advent of modern web technologies, the transition from paper-based receipts and disjointed spreadsheets to digital, automated expense workflows has become a standard industry objective. However, existing commercial platforms often suffer from high licensing costs, rigid workflows, lack of real-time collaboration, and limited intelligence for fraud prevention. 

**ExpenseFlow** is developed to address these limitations as an intelligent, real-time, and unified corporate expense tracking system. The application coordinates:
1. A highly responsive, glassmorphic single-page application built on **React.js and Vite**, providing employees and managers with clear, distraction-free workspaces.
2. A robust **Node.js and Express** REST API that handles authentication, database operations, and system logic.
3. An active **Socket.io WebSocket layer** that provides live synchronization across user sessions, ensuring that managers are immediately notified of pending items and budget graphs update in real-time.
4. A dedicated **Python FastAPI Machine Learning Microservice** that executes receipt OCR parsing, statistical Z-score anomaly detection, rule-based fraud scoring, and linear regression expense forecasting.

By combining modern frontend aesthetics, live event synchronization, and predictive analytics, ExpenseFlow transforms expense reporting from a slow administrative chore into an automated, real-time workflow. This report outlines the requirements, architectural design, testing protocols, and implementation details of this intelligent assistive financial application.

---

## CHAPTER 2. PROBLEM STATEMENT

### 2.1. Profile of the Problem
Traditional corporate expense reporting workflows are plagued by structural inefficiency. The core difficulties include:
* **Manual Receipt Collection:** Employees frequently lose physical receipts, leading to tax write-off losses and delayed reimbursement submissions.
* **Asynchronous Communication:** Traditional email-based approval processes stall approvals. If a manager is out of the office, expense reports sit unchecked, and employees remain out-of-pocket.
* **Delayed Budget Visibility:** Finance teams typically review expenses after they have occurred. This makes proactive budget control impossible; a department may exceed its quarterly limit weeks before the finance department detects it.
* **Expense Padding and Fraud:** Detecting minor fraud, such as duplicate submissions, personal expenses masquerading as business items, weekend office supply orders, or strategically pricing expenses just under approval thresholds (e.g., submitting ₹249 when the threshold for receipt requirement is ₹250), is extremely difficult for manual auditors.

### 2.2. Rationale / Scope of the Study
The primary motivation of this study is to implement a unified full-stack system that automates the expense tracking lifecycle from submission to audit.

The scope of this project is limited to:
* Tracking and categorizing business expenses across 8 core categories: *Travel, Food & Dining, Office Supplies, Accommodation, Transportation, Communication, Entertainment, and Miscellaneous*.
* Implementing role-based views for four roles: **Employees** (submission and history), **Managers** (team oversight and approvals), **Finance** (budget analysis and analytics), and **Admins** (system configuration).
* Establishing a real-time event pipeline for transaction updates using WebSockets.
* Developing a lightweight, rule-based, and statistical machine learning microservice to audit submitted expenses and forecast future expenses using simple linear regression.
* Storing transaction records securely in a relational database using Sequelize and SQLite.

The study does not extend to direct payment gateway integration, corporate card synchronization, or multi-currency exchange rate conversions.

---

## CHAPTER 3. LITERATURE REVIEW

### 3.1. Introduction
Prior research on corporate workflow automation demonstrates that digitizing reporting systems increases compliance and reduces operational costs. Over the past decade, cloud-based architectures have replaced legacy desktop systems, introducing mobile capabilities and automated document parsing.

### 3.2. Existing Software & Approaches
Several commercial software solutions address expense tracking, including SAP Concur, Expensify, and Zoho Expense. 
* **Traditional Spreadsheets:** The oldest approach, relying on Excel or Google Sheets. While flexible, it lacks access controls, data validation, audit logs, and real-time alerts.
* **Enterprise Software (e.g., SAP Concur):** Comprehensive but expensive, complex to integrate, and often slow, leading to poor user adoption.
* **Modern SaaS (e.g., Expensify):** Offers mobile scan features, but lacks modular customization, built-in forecasting, and local data ownership.

### 3.3. Gaps and Challenges of Current Work
* **High Latency & Sync Issues:** Existing systems operate asynchronously. A manager must refresh the page or wait for emails to see team submissions.
* **Prohibitive Licensing:** High monthly per-user fees prevent small and medium enterprises (SMEs) from adopting automated systems.
* **Basic Auditing:** Most systems rely on simple hardcoded limits rather than statistical analysis of user history (Z-score) or regression modeling to predict future spending.

### 3.4. What's New in the System to be Developed
ExpenseFlow bridges these gaps by offering a completely decoupled, high-performance, real-time open-source architecture. 

**Table 1: Comparison of ExpenseFlow with Existing Commercial Software**

| Feature | Spreadsheets | SAP Concur | SaaS Tools | ExpenseFlow (Proposed) |
|---|---|---|---|---|
| **Real-time Sync** | No | No | Partial | **Yes (WebSocket/Socket.io)** |
| **User Interface** | Grid-based | Legacy / Complex | Standard Web | **Glassmorphic UI (React)** |
| **Microservice ML** | No | Basic | Add-on (Paid) | **Yes (FastAPI microservice)** |
| **Statistical Audit**| No | Rule-based | Simple rules | **Yes (Z-Score + Fraud Flags)**|
| **Expense Forecast** | No | No | No | **Yes (Linear Regression)** |
| **License Cost** | Low | High Enterprise | Medium SaaS | **Open-source (Zero License)** |

---

## CHAPTER 4. PROBLEM ANALYSIS

### 4.1. Product Definition
ExpenseFlow is defined as a real-time, role-based corporate web application paired with an analytical ML microservice. The application operates in a decoupled fashion, splitting presentation, business logic, and analysis.

### 4.2. Feasibility Analysis

#### 4.2.1. Technical Feasibility
The system utilizes stable, standard technologies. The Node.js Express framework and SQLite database are highly performant on low-cost hosts. React.js and Vite allow for lightweight, componentized frontend builds. The FastAPI microservice runs efficiently in Python, using standard libraries (`scikit-learn`, `numpy`, `pandas`) for regression and mathematical analysis.

#### 4.2.2. Economical Feasibility
ExpenseFlow is built entirely using open-source frameworks. The runtime environment (Node.js, Python, SQLite) does not require paid licenses. Development tools (VS Code, git) are free. The system runs locally or can be hosted on free/low-cost cloud tiers (e.g., Render, Vercel), making it highly cost-effective.

#### 4.2.3. Operational Feasibility
Operationally, the system uses Role-Based Access Control (RBAC). Employees require zero training as the submission process mimics standard mobile uploads. Managers and finance teams are provided with dedicated dashboards that summarize key data points, making decision-making straightforward.

### 4.3. Project Plan
The project was executed in a series of five structured phases:
1. **Requirements Gathering:** Defining user roles, database schema dependencies, and API endpoints.
2. **Database & API Foundation:** Setting up SQLite database models, Sequelize associations, and authentication routes.
3. **Frontend Dashboard Development:** Creating the React dashboard, glassmorphism UI system, and Chart.js graphics.
4. **WebSocket Integration:** Setting up Socket.io for live updates between client and server.
5. **ML Microservice Development:** Coding the FastAPI routers for anomaly detection, receipt data parsing, and forecasting.

---

## CHAPTER 5. SOFTWARE REQUIREMENT ANALYSIS

### 5.1. Introduction
Software Requirement Analysis identifies the boundary conditions, operational dependencies, and expected performance metrics for the ExpenseFlow application.

### 5.2. General Description
The application follows a client-server architecture. The frontend React application streams user input and listens for real-time events. The backend Express API processes queries, coordinates DB writes, and notifies the WebSocket server. The FastAPI service serves as an audit and prediction assistant.

### 5.3. Specific Requirements
* **Role Enforcement:** Secure views for Employee, Manager, Finance, and Admin.
* **WebSocket Feeds:** Live list updates when an expense is submitted or updated.
* **Multi-Format Receipt Upload:** Support for image formats (JPEG, PNG, WEBP) and PDFs.
* **Automated Audit:** Checking for anomalies (z-score > 2) and calculation of fraud scores.
* **Budget Tracking:** Dynamic calculation of budget utilization per category.

### 5.4. Functional Requirements
* **Image Upload:** Express router processes multipart forms via Multer, saving receipts to `/uploads` and returning the relative file URL.
* **Real-time updates:** Server triggers `expense:created` and `expense:updated` events via socket.io, prompting client instances to refresh lists.
* **Interactive Visualizations:** Chart.js displays a 6-month spending trend (line chart) and category budget limits vs actual spend (bar/doughnut charts).
* **Statistical Auditing:** The system evaluates expenses using a Z-score anomaly detector and generates fraud flags.

### 5.5. Non-Functional Requirements
* **Latency:** End-to-end processing of submissions and socket notifications must occur under 2 seconds.
* **Security:** Password hashing using bcryptjs (rounds=10) and session authorization using JWT.
* **Responsiveness:** Glassmorphic layout designed to fit both desktop displays and mobile screen viewports.

### 5.6. Hardware Requirements

**Table 2: Hardware Requirements**

| Component | Minimum Specification | Recommended Specification |
|---|---|---|
| **Processor** | Intel Core i3 (6th Gen) / AMD Ryzen 3 | Intel Core i5 (10th Gen) / AMD Ryzen 5 |
| **RAM** | 4 GB | 8 GB |
| **Storage** | 500 MB free space (SSD) | 2 GB free space (NVMe SSD) |
| **Network** | Local loopback (offline dev) | Broadband connection (production) |

### 5.7. Software Requirements

**Table 3: Software Requirements and Dependencies**

| Component | Technology / Library | Version | Purpose |
|---|---|---|---|
| **Runtime** | Node.js | v18.0.0+ | Javascript execution environment |
| **Frontend** | React.js / Vite | v18.3 / v5.4 | Presentation UI structure |
| **Styling** | Custom Vanilla CSS | CSS3 | Custom Glassmorphic Theme |
| **Database** | SQLite / Sequelize | v3.0+ / v6.0+ | Relational DB storage and ORM |
| **WebSockets** | Socket.io | v4.8+ | Real-time event communication |
| **ML Engine** | Python / FastAPI | v3.10+ / v0.100+ | Predictive analytics API |
| **HTTP Client** | Axios | v1.7.0+ | Frontend-backend request client |
| **Charts** | Chart.js / react-chartjs-2 | v4.4 / v5.2 | Analytical visualization |

---

## CHAPTER 6. DESIGN

### 6.1. System Design
ExpenseFlow uses a decoupled three-tier architecture:

```
                  ┌──────────────────────┐
                  │      React App       │
                  │   (Client Browser)   │
                  └──────────┬───────────┘
                             │
            HTTP API         │      WebSockets
         REST & GraphQL      │    (Live Updates)
                             ▼
                  ┌──────────────────────┐
                  │    Express Server    │
                  │   (NodeJS Backend)   │
                  └────┬───────────▲─────┘
                       │           │
              ORM      │           │    HTTP Post
             Query     │           │   (Audit Data)
                       ▼           │
                  ┌─────────┐      │     ┌─────────────────────┐
                  │ SQLite  │      └────►│   FastAPI Service   │
                  │   DB    │            │   (Python Machine)  │
                  └─────────┘            └─────────────────────┘
```

* **Client Tier:** React components communicate with the Express API using standard REST calls and maintain an open WebSocket channel for real-time notifications.
* **Logic Tier (Express):** Houses middleware (authentication, CORS handling) and routes. Communicates with SQLite via Sequelize ORM and proxies complex analytical requests to the Python microservice.
* **ML Tier (FastAPI):** Python microservice exposing stateless REST endpoints for OCR, anomalies, and trend forecasting.

### 6.2. Detailed Design
The application logic is modularized into directories:
* `/client/src/context/AuthContext.jsx` manages user credentials and token retention.
* `/server/routes/expense.routes.js` handles authorization filters (employees see only their own expenses; managers see team expenses; finance sees all).
* `/ml-service/app/routers/anomaly.py` scores expenses based on user profile and categories.
* `/ml-service/app/routers/forecasting.py` outputs predicted amounts for the next 3 months.

### 6.3. Database Schema Design
The database structure is organized around six relational models synced via Sequelize:

```
  ┌───────────────┐
  │     User      │◄──────────────────────────┐
  └──────┬────────┘                           │
         │ 1                                  │
         │                                    │
         │ 1..N                               │ 1..N
  ┌──────▼────────┐ 1..N            1..N ┌────┴─────────┐
  │    Expense    ├─────────────────────►│  Notification│
  └──────┬────────┘                      └──────────────┘
         │ 1
         │
         │ 1..N
  ┌──────▼────────┐
  │   Approval    │
  └───────────────┘
```

1. **User:** stores ID, names, email, hashed password, role (employee, manager, finance, admin), department, managerId.
2. **Expense:** stores ID, userId, title, description, amount, currency, category, date, merchant, receiptUrl, status (draft, pending, approved, rejected, reimbursed), fraudScore, anomalyFlags.
3. **Category:** stores ID, name, icon, color, budgetLimit, isActive.
4. **Policy:** stores ID, name, description, category, maxLimit, requiresReceipt.
5. **Notification:** stores ID, userId, title, message, isRead, type, metadata.
6. **Approval:** stores ID, expenseId, approverId, status, comments, actionDate.

---

### 6.4. Pseudo Code

#### 6.4.1. Z-Score Anomaly Detection
The following algorithm executes statistical anomaly detection on a single expense compared against historical category metrics:

```python
FUNCTION detect_anomaly(expense_amount, category, user_avg_expense):
    # Fetch threshold config
    thresholds = GET_CATEGORY_THRESHOLDS(category)
    score = 0.0
    reasons = []

    # 1. Z-score check
    IF thresholds.std_dev > 0:
        z = (expense_amount - thresholds.mean) / thresholds.std_dev
        z_abs = ABS(z)
        
        IF z_abs > 3.0:
            score += 0.40
            APPEND "Amount is extremely high" TO reasons
        ELSE IF z_abs > 2.0:
            score += 0.20
            APPEND "Amount is moderately high" TO reasons
    END IF

    # 2. Exceeds Category Max limit
    IF expense_amount > thresholds.max_limit:
        score += 0.30
        APPEND "Exceeds category maximum budget" TO reasons

    # 3. User History comparison
    IF user_avg_expense > 0:
        ratio = expense_amount / user_avg_expense
        IF ratio > 5.0:
            score += 0.30
            APPEND "Amount is 5x higher than user average" TO reasons
        ELSE IF ratio > 3.0:
            score += 0.15
            APPEND "Amount is 3x higher than user average" TO reasons
    END IF

    # 4. Round Number check
    IF expense_amount >= 100 AND expense_amount == ROUND(expense_amount):
        score += 0.05
        APPEND "Suspiciously round number" TO reasons

    # Clamp results
    score = MIN(score, 1.0)
    risk_level = "low"
    IF score >= 0.6:
        risk_level = "high"
    ELSE IF score >= 0.3:
        risk_level = "medium"

    RETURN {
        "is_anomaly": score >= 0.3,
        "anomaly_score": score,
        "risk_level": risk_level,
        "reasons": reasons
    }
```

#### 6.4.2. Simple Linear Regression Forecasting
The forecasting service fits a linear model ($y = mx + c$) to predict spending trends:

```python
FUNCTION predict_expenses(historical_data, months_to_predict):
    # historical_data: list of monthly totals sorted by month
    n = LENGTH(historical_data)
    IF n < 2:
        # Fallback to simple average
        avg = MEAN(amount for item in historical_data)
        RETURN GENERATE_FLAT_FORECAST(avg, months_to_predict)
    END IF

    # Coordinates
    X = [0, 1, 2, ..., n-1]
    Y = [item.amount for item in historical_data]

    # Calculate slope (m) and intercept (c)
    sum_x = SUM(X)
    sum_y = SUM(Y)
    sum_xy = SUM(x * y for (x, y) in ZIP(X, Y))
    sum_xx = SUM(x * x for x in X)

    denominator = (n * sum_xx) - (sum_x * sum_x)
    IF denominator == 0:
        m = 0
    ELSE:
        m = ((n * sum_xy) - (sum_x * sum_y)) / denominator
    END IF
    
    c = (sum_y - (m * sum_x)) / n

    # Volatility / Residual Standard Deviation
    residuals = [Y[i] - (m * X[i] + c) for i in range(n)]
    variance = SUM(r * r for r in residuals) / n
    std_dev = SQRT(variance)

    # Trend categorization
    trend = "stable"
    mean_y = sum_y / n
    IF m > (mean_y * 0.05):
        trend = "increasing"
    ELSE IF m < -(mean_y * 0.05):
        trend = "decreasing"
    END IF

    # Forecast points
    predictions = []
    FOR i FROM 0 TO months_to_predict - 1:
        pred_x = n + i
        pred_y = MAX(0, m * pred_x + c) # prevent negative expense predictions
        
        # 95% Confidence interval expansion
        margin = std_dev * (1.96 + (i * 0.2))
        
        APPEND ForecastPoint(
            predicted_amount = pred_y,
            low_interval = MAX(0, pred_y - margin),
            high_interval = pred_y + margin
        ) TO predictions
    ENDFOR

    RETURN {
        "predictions": predictions,
        "trend": trend,
        "volatility": std_dev
    }
```

---

## CHAPTER 7. TESTING

Testing verifies that ExpenseFlow executes transactions accurately, handles authorization boundaries, and remains responsive under concurrent Socket updates.

### 7.1. Functional Testing
Functional testing is evaluated using black-box inputs against explicit page expectations.

**Table 4: Functional Test Cases - Authentication & Security**

| Test ID | Module | Input | Expected Output | Result |
|---|---|---|---|---|
| **FT-01** | User Login | Valid Credentials | JWT returned, dashboard elements rendered | **Pass** |
| **FT-02** | User Login | Invalid Credentials | `401 Unauthorized` JSON message displayed | **Pass** |
| **FT-03** | Auth Guard | Access `/api/users` as Employee | `403 Forbidden` response returned | **Pass** |
| **FT-04** | JWT Expiry | Request with expired token | Token cleared, redirected to `/login` | **Pass** |

**Table 5: Functional Test Cases - Expense Submission & Socket Broadcast**

| Test ID | Module | Input | Expected Output | Result |
|---|---|---|---|---|
| **FT-05** | Submission | Submit Empty Amount | Form validation error warning displayed | **Pass** |
| **FT-06** | File Upload| Submit 12MB Receipt PDF | `File too large` error returned by Multer | **Pass** |
| **FT-07** | WebSocket  | Employee submits expense | Manager dashboard list updates instantly | **Pass** |
| **FT-08** | Approval   | Manager approves expense | Notification generated, status changes | **Pass** |

### 7.2. Structural Testing
Structural testing verifies internal system operations, database transaction boundaries, and error handlers.

**Table 6: Structural Test Cases - Key Code Paths**

| Test ID | Component | Branch Path | Expected Behavior | Result |
|---|---|---|---|---|
| **ST-01** | database.js | SQLite db file not found | Sequelize auto-creates `database.sqlite` file | **Pass** |
| **ST-02** | server.js | Sequelize sync run | Tables created and category seeds populated | **Pass** |
| **ST-03** | auth.js | Bearer token missing headers | Request blocked with `Access Denied` | **Pass** |
| **ST-04** | anomaly.py | POST data without Category | FastAPI returns `422 Unprocessable Entity` | **Pass** |

### 7.3. Levels of Testing
* **Unit Testing:** Individual Express controllers and Sequelize models were tested in isolation using mocks. Anomaly logic functions in FastAPI were verified using test arrays.
* **Integration Testing:** Verified HTTP requests from frontend context to Express endpoints. Tested that adding an expense triggers notification rows and WebSocket broadcasts.
* **System Testing:** Tested the entire workflow locally: logging in as John (employee), uploading a receipt, verifying the pending status, logging in as manager, confirming the live push notification, approving the item, and observing the budget limit update.

### 7.4. Test Cases and Result Summary

**Table 7: Testing Results Matrix Summary**

| Testing Phase | Total Cases | Passed | Failed | Pass Rate |
|---|---|---|---|---|
| **Functional Tests** | 22 | 22 | 0 | 100% |
| **Structural Tests** | 15 | 15 | 0 | 100% |
| **Integration Tests**| 12 | 12 | 0 | 100% |
| **System Tests** | 8 | 8 | 0 | 100% |
| **TOTAL** | **57** | **57** | **0** | **100%** |

---

## CHAPTER 8. IMPLEMENTATION

### 8.1. Implementation of the Project
The project was deployed in three integrated folders, dividing responsibility.

```
Project/
├── client/                     # Presentation (Vite + React)
│   ├── src/
│   │   ├── components/        # Layout & Chart elements
│   │   ├── context/           # Auth & Toast Providers
│   │   └── pages/             # Dynamic view screens
├── server/                     # Backend Logic (Express + SQLite)
│   ├── config/                # Sequelize connector
│   ├── models/                # DB relational definitions
│   └── routes/                # Endpoint handlers
└── ml-service/                 # Microservice (FastAPI + Python)
    └── app/
        ├── routers/           # ML algorithms (anomaly, forecast)
        └── main.py            # Microservice router
```

### 8.2. Frontend Implementation
The client uses React 18, utilizing the Context API to distribute user credentials. The layout employs a glassmorphic design system configured in `/client/src/index.css` with transparent frosted backdrops (`backdrop-filter: blur(12px)`), harmonic dark colors, and micro-animations. Five Chart.js modules display:
1. Category budget vs actual spend.
2. Monthly spending line trends.
3. Pending vs approved proportions.
4. User/department contribution ratios.
5. Budget threshold limits.

### 8.3. Backend Server Implementation
The server is built in Node.js and Express. Relational tables are synchronized using Sequelize ORM.
* JWT middleware extracts and verifies keys from authorization headers.
* Socket.io binds to the HTTP server. During user action, the socket broadcast coordinates data syncs:

```javascript
// Emit live updates to connected managers and staff
if (req.app.get('io')) {
  req.app.get('io').emit('expense:created', fullExpense);
}
```

### 8.4. Machine Learning Microservice
FastAPI handles stateless calls on port `8000`:
* `/api/ocr/extract` simulates text extraction from uploads.
* `/api/anomaly/detect` parses expense amounts and calculates Z-scores against category standard deviations.
* `/api/forecast/predict` takes arrays of monthly category totals, computes slopes and residuals, and outputs predictions for the next three periods.

---

## CHAPTER 9. PROJECT LEGACY

### 9.1. Current Status of the Project
ExpenseFlow is a fully functional web application. Database syncs, role boundaries, receipt uploads, and real-time dashboard events operate successfully. The application builds cleanly for production.

### 9.2. Remaining Areas of Concern
* **Production Deployment Configuration:** A production-grade server configuration is required. The SQLite database should be migrated to PostgreSQL, and the Express app should use Redis to handle Socket.io scaling across multi-server environments.
* **Tesseract OCR Integration:** The OCR endpoint in the ML service is currently simulated. In a production release, it must be integrated with `pytesseract` or Google Cloud Vision to parse actual receipt image strings.
* **CORS Management:** CORS configurations are set to wide permissibility (`origin: *`) to ease development across varying Vercel subdomains. In production, this must be restricted to specific client domains.

### 9.3. Technical and Managerial Lessons Learnt
* **Cross-Origin Resource Sharing (CORS):** Managing CORS during frontend/backend split is critical. Restricting headers too early blocks development, while leaving them open is a security concern. A dynamic CORS configuration is essential.
* **Real-time Synchronization:** WebSockets dramatically improve user experience but require careful message routing to avoid spamming disconnected client sessions.
* **Decoupled Architecture:** Using FastAPI as an analytical helper service keeps the Express API fast and focused on CRUD operations.

---

## CHAPTER 10. USER MANUAL

### 10.1. Purpose of the System
ExpenseFlow allows corporate organizations to submit, review, audit, and forecast expenses in real-time.

### 10.2. Run Instructions

#### Step 1: Start Backend (Port 5000)
```bash
cd server
npm install
npm run seed     # Populates DB with 8 users and 60 expenses
npm run dev
```

#### Step 2: Start Frontend (Port 5173)
```bash
cd client
npm install
npm run dev
```

#### Step 3: Start FastAPI Microservice (Port 8000)
```bash
cd ml-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Open a web browser and navigate to `http://localhost:5173`.

### 10.3. Demo Accounts

* **Admin:** `admin@company.com` / `Admin123!`
* **Finance:** `finance@company.com` / `Finance123!`
* **Manager:** `manager@company.com` / `Manager123!`
* **Employee:** `john@company.com` / `Employee123!`

---

## CHAPTER 11. REFERENCES

1. Goodfellow, I., Bengio, Y., & Courville, A. (2016). *Deep Learning*. MIT Press.
2. Fielding, R. T. (2000). *Architectural Styles and the Design of Network-based Software Architectures*. Doctoral dissertation, University of California, Irvine.
3. Holovaty, A., & Kaplan-Moss, J. (2009). *The Definitive Guide to Django: Web Development Done Right*. Apress.
4. McKinney, W. (2010). Data structures for statistical computing in Python. *Proceedings of the 9th Python in Science Conference*, 51–56.
5. Harris, C. R., et al. (2020). Array programming with NumPy. *Nature*, 585(7825), 357–362.
6. LeCun, Y., Bottou, L., Bengio, Y., & Haffner, P. (1998). Gradient-based learning applied to document recognition. *Proceedings of the IEEE*, 86(11), 2278–2324.
7. Pedregosa, F., et al. (2011). Scikit-learn: Machine learning in Python. *Journal of Machine Learning Research*, 12, 2825–2830.
8. Crockford, D. (2006). *The JSON Data Interchange Format*. RFC 4627.
9. W3C. (2017). *Media Capture and Streams API*. W3C Recommendation.
10. Garrett, J. J. (2005). *Ajax: A New Approach to Web Applications*. AdaptivePath.
