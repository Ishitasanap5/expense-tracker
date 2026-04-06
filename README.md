# Smart Expense Tracker API

**Live Demo:** [https://expense-tracker-ceij.onrender.com](https://expense-tracker-ceij.onrender.com)

**Tech Stack:** Node.js · Express · MongoDB · Mongoose · JWT · REST API

**Description:**
A full-featured backend API for a smart expense tracking app supporting multiple users. Includes authentication, budget alerts, recurring expenses, analytics, and trends. Designed to be **SaaS-ready**, scalable, and production-grade.

---

## Features

* **User Authentication:** Register and login securely using JWT.
* **CRUD Expenses:** Add, update, delete, and fetch expenses.
* **Budget Alerts:** Set monthly budgets with real-time alerts when exceeded.
* **Recurring Expenses:** Automatically generate daily, weekly, or monthly expenses.
* **Analytics:** Get total spending, category breakdowns, top categories, and trends.
* **Filters & Pagination:** Fetch expenses with category/date filters and paginated results.
* **Forecasting:** Predict current month spending based on trends.

---

## API Endpoints

| Method | Endpoint                       | Description                                      |
| ------ | ------------------------------ | ------------------------------------------------ |
| POST   | `/auth/register`               | Register a new user                              |
| POST   | `/auth/login`                  | Login and get JWT                                |
| GET    | `/expenses`                    | Get all expenses (supports filters & pagination) |
| POST   | `/expenses`                    | Add a new expense                                |
| PUT    | `/expenses/:id`                | Update an expense                                |
| DELETE | `/expenses/:id`                | Delete an expense                                |
| POST   | `/expenses/recurring-generate` | Generate recurring expenses                      |
| GET    | `/analytics`                   | Get spending analytics and trends                |

---

## Installation

1. Clone the repo:

```bash
git clone https://github.com/Ishitasanap5/expense-tracker.git
cd expense-tracker/backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
MONGO_URI=<your_mongodb_atlas_uri>
JWT_SECRET=<your_secret_key>
PORT=3000
```

4. Start the server:

```bash
npm run dev
```

---

## Usage

* Use **Postman** or **curl** to test the API endpoints.
* Your recurring expenses, analytics, budget alerts, and pagination features are ready to use.
* API is deployed live at: [https://expense-tracker-ceij.onrender.com](https://expense-tracker-ceij.onrender.com)

---

## Future Enhancements

* Connect a **React/Next.js frontend** for full-stack experience.
* Add **role-based access** for multiple users in a SaaS setup.
* Extend analytics with **visual dashboards**.

