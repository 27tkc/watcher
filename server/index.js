import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ use import instead of require (you're using ES modules)

dotenv.config();

const app = express();

// ✅ DB Connection
const connect = () => {
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ DB connection error:", err);
      process.exit(1);
    });
};

// ✅ Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000", "https://watcher-ca.vercel.app"],
    credentials: true, // 🔐 if you're using cookies, JWTs, etc.
  })
);

app.use(cookieParser());
app.use(express.json());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// ✅ Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  connect();
  console.log(`🚀 Backend running on port ${PORT}`);
});
