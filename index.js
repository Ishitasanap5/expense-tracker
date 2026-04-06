import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import trendsRoutes from "./routes/trendsRoutes.js";


dotenv.config();

const app = express();

// connect DB
connectDB();

// middleware
app.use(cors());
app.use(express.json());


// routes
app.use("/expenses", expenseRoutes);
app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/trends", trendsRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));