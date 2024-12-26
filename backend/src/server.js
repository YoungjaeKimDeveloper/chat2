import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/messageRoute.js";
import cookieParser from "cookie-parser";
import { connectDB } from "../lib/db.js";
import { io, server, app } from "../lib/socket.js";
import cors from "cors";

dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
// First Ending point먼저 나눠서 세부하게 나눠주기

// API를 넣는이유는 로직을 다루겠다는 의미임
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING IN ${PORT}`);
  connectDB();
});
