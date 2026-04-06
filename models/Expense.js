import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },

    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recurring: { type: Boolean, default: false },
    interval: { 
      type: String, 
      enum: ["daily", "weekly", "monthly"], 
      default: "monthly" 
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;