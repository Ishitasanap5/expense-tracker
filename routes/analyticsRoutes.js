import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


//  Monthly Analytics
router.get("/monthly", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;

    // current month range
    const start = new Date();
    start.setDate(1);
    start.setHours(0, 0, 0, 0);

    const end = new Date();

    // fetch user expenses for this month
    const expenses = await Expense.find({
      user: userId,
      date: { $gte: start, $lte: end },
    });

    let total = 0;
    let categoryMap = {};

    expenses.forEach((exp) => {
      total += exp.amount;

      if (!categoryMap[exp.category]) {
        categoryMap[exp.category] = 0;
      }

      categoryMap[exp.category] += exp.amount;
    });

    // find top category
    let topCategory = null;
    let max = 0;

    for (let cat in categoryMap) {
      if (categoryMap[cat] > max) {
        max = categoryMap[cat];
        topCategory = cat;
      }
    }

    res.json({
      total,
      categoryBreakdown: categoryMap,
      topCategory,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;