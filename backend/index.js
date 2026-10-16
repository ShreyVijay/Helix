import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { app, server } from "./socket/socket.js";

const port = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

app.get("/health", (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1;
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? "ok" : "database unavailable",
  });
});

const start = async () => {
  if (!process.env.MONGODB_URL) throw new Error("MONGODB_URL must be configured");
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET must be configured");
  await connectDb();
  server.listen(port, "0.0.0.0", () => {
    console.log(`server started on port ${port}`);
  });
};

start().catch((error) => {
  console.error("server startup failed:", error);
  process.exit(1);
});
