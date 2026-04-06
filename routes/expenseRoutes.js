import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from '../models/User.js';

const router = express.Router();

// ➕ Create Expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    // 🔹 Fetch the logged-in user first
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔹 Create the expense
    const expense = new Expense({
      ...req.body,
      user: req.user,
    });

    const saved = await expense.save();

    // 🔹 Calculate total spending
    const expenses = await Expense.find({ user: req.user });
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    // 🔹 Check budget and generate alert
    let alert = null;
    if (user.budget > 0 && total > user.budget) {
      alert = `Warning: You exceeded your monthly budget of ${user.budget}`;
    }

    res.json({ expense: saved, alert });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 Get All Expenses
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
    res.json(expenses);
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