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

export default router;