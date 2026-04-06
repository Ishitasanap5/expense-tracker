// routes/expenseRoutes.js
import express from "express";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Create Expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user);

    const expense = new Expense({
      ...req.body,
      user: req.user,
    });

    const saved = await expense.save();

    // Check budget alert
    const expenses = await Expense.find({ user: req.user });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    let alert = null;
    if (user.budget > 0 && total > user.budget) {
      alert = `Warning: You exceeded your monthly budget of ${user.budget}`;
    }

    res.json({ expense: saved, alert });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get Expenses with Filters & Pagination
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Filters
    const { category, startDate, endDate } = req.query;

    let filter = { user: userId };

    if (category) filter.category = category;
    if (startDate || endDate) filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);

    const expenses = await Expense.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalExpenses = await Expense.countDocuments(filter);

    res.json({
      page,
      limit,
      totalExpenses,
      totalPages: Math.ceil(totalExpenses / limit),
      expenses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ Update Expense
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(expense);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ Delete Expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!expense) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔁 Generate Recurring Expenses
router.post("/recurring-generate", authMiddleware, async (req, res) => {
  try {
    const userId = req.user;
    const recurringExpenses = await Expense.find({ user: userId, recurring: true });
    const newExpenses = [];
    const today = new Date();

    for (let exp of recurringExpenses) {
      let lastDate = new Date(exp.date);
      let shouldCreate = false;

      switch (exp.interval) {
        case "daily":
          shouldCreate = lastDate.toDateString() !== today.toDateString();
          break;
        case "weekly":
          const lastWeek = getWeekNumber(lastDate);
          const thisWeek = getWeekNumber(today);
          shouldCreate = lastWeek !== thisWeek;
          break;
        case "monthly":
          shouldCreate = lastDate.getMonth() !== today.getMonth() || lastDate.getFullYear() !== today.getFullYear();
          break;
      }

      if (shouldCreate) {
        const newExp = new Expense({
          user: userId,
          amount: exp.amount,
          category: exp.category,
          description: exp.description,
          date: today,
          recurring: exp.recurring,
          interval: exp.interval,
        });
        await newExp.save();
        newExpenses.push(newExp);
      }
    }

    res.json({ message: "Recurring expenses generated", newExpenses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper function to calculate week number
function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

export default router;