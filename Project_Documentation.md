# Building ExpenseFlow: A Real-Time Expense Tracker
*Project Documentation & Developer Notes*

## Why I Built This
Expense reporting in most companies is still surprisingly painful. Employees lose paper receipts, managers get annoyed by the endless approval emails, and finance teams never really know how much money the company is burning until the end of the month. 

I built **ExpenseFlow** to fix this. It’s a completely digital, web-based platform that makes tracking expenses feel as smooth as using a modern social media app. Employees can log expenses in seconds, managers can approve them with one click, and everything updates live.

---

## What Powers the App (The Tech Stack)

When putting this together, I wanted a stack that was fast, reliable, and easy to run anywhere. I went with a slightly modified PERN/MERN stack, using SQLite to make local development painless.

### The Frontend (What the user sees)
* **React.js & Vite:** I used React to build the interface because it makes handling dynamic data a breeze. I paired it with Vite instead of Create React App because Vite is incredibly fast—it makes the developer experience so much better.
* **Custom "Glassmorphism" UI:** I deliberately avoided heavy CSS frameworks like Bootstrap or Tailwind. Instead, I wrote custom CSS to create a premium "glass" effect (frosted, semi-transparent backgrounds). It just feels a lot more modern.
* **Context API:** For keeping track of who is logged in, I just used React's built-in Context API. Redux felt like overkill for this.
* **Recharts:** Finance teams love charts, so I pulled in Recharts to build out the dashboard visuals (budget tracking, spending trends).

### The Backend (The engine room)
* **Node.js & Express:** This is the core API that handles all the requests, security, and logic.
* **SQLite & Sequelize:** I used SQLite because it stores the whole database in a single file on your computer. You don't have to install heavy database servers to run the code. To talk to the database, I used Sequelize (an ORM). It lets me write database queries using normal JavaScript instead of raw SQL strings, which prevents nasty security bugs like SQL injection.
* **Socket.io (WebSockets):** This is my favorite part of the app. Normally, you have to refresh a page to see new data. With Socket.io, there's a constant, open connection between the browser and the server. When an employee hits "Submit" on an expense, the server broadcasts a message to everyone, and the dashboard feed updates instantly.
* **Security (JWT & bcryptjs):** Passwords are mathematically scrambled (hashed) using bcryptjs before they even hit the database. When someone logs in, the server hands them a JSON Web Token (JWT), which acts like a digital VIP wristband for their session.

---

## The Coolest Features

1. **Role-Based Views:** 
   The app is smart enough to know who you are. If you log in as an employee, you just see your own stuff. If you log in as an Admin, a whole new "User Management" sidebar appears so you can add or remove people from the company.
   
2. **The Smart Fraud Detector:**
   I wrote a small logic engine that analyzes expenses right when they are submitted. If someone tries to submit an expense for exactly ₹10,000 (round numbers are suspicious) or submits an office expense on a Sunday, the system flags it with a red warning badge. It basically tells the manager, "Hey, look closely at this one before you approve it."

3. **Live Budget Tracking:**
   Every department has a budget limit. As expenses get approved, the progress bars fill up. If the Marketing team is about to blow their travel budget, the finance team can see it happening in real time.

---

## How I Deployed It to the Internet

Getting the app off my local computer and onto the web required separating the frontend from the backend.

**Hosting the Backend (Render.com)**
I pushed the Express server code to a free service called Render. They spun up a Linux container, installed Node, and started the server. The tricky part here was **CORS** (Cross-Origin Resource Sharing). Browsers hate it when a website on one domain tries to talk to an API on another domain. I had to explicitly tell my Express server to accept traffic coming from the frontend website.

**Hosting the Frontend (Vercel)**
For the React code, Vercel is basically magic. I linked my GitHub repo to Vercel, and it automatically ran `npm run build` to squash all my React code into optimized HTML and JavaScript files. 

To tie them together, I just grabbed the live URL that Render gave me (`https://corporate-expense-tracker-test.onrender.com`) and pasted it directly into the frontend code. Now, when a user clicks a button on the Vercel site, it shoots a request over to the Render server, reads the database, and sends the data back seamlessly.
