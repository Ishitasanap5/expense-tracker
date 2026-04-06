import express from "express";
import Expense from "../models/Expense.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ➕ Create Expense
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { amount, category, description } = req.body;

    const expense = new Expense({
      amount,
      category,
      description,
      user: req.user, // ✅ comes from JWT
    });

    const saved = await expense.save();
    res.json(saved);
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