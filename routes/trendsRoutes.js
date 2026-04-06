import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/6months", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const today = new Date();
    const months = [];

    // last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    const monthlyTotals = {};
    const categoryTrends = {};
    let currentMonthForecast = 0;

    for (let m of months) {
      const start = new Date(m.year, m.month, 1);
      const end = new Date(m.year, m.month + 1, 0, 23, 59, 59);

      const expenses = await Expense.find({
        user: userId,
        date: { $gte: start, $lte: end },
      });

      const monthName = start.toLocaleString("default", { month: "short" });
      const total = expenses.reduce((sum, e) => sum + e.amount, 0);
      monthlyTotals[monthName] = total;

      expenses.forEach((e) => {
        if (!categoryTrends[e.category]) categoryTrends[e.category] = [];
      });

      // build category trends
      for (let category in categoryTrends) {
        const catTotal = expenses
          .filter((e) => e.category === category)
          .reduce((sum, e) => sum + e.amount, 0);
        categoryTrends[category].push(catTotal);
      }

      // forecast for current month
      if (m.month === today.getMonth() && m.year === today.getFullYear()) {
        const daysPassed = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        currentMonthForecast = Math.round((total / daysPassed) * daysInMonth);
      }
    }

    res.json({ monthlyTotals, categoryTrends, currentMonthForecast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;