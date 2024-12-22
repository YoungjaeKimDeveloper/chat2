import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
const router = express.Router();

// 정보를 보낼때는 post로 보내주어야한다
router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
