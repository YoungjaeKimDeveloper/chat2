import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
const router = express.Router();

router.get("/users", verifyToken, getUsersForSidebar);
router.post("/:id", verifyToken, getMessages);
router.get("/send/:id", verifyToken, sendMessage);
export default router;
