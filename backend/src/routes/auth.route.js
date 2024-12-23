import express from "express";
import { verifyToken } from "../../middleware/auth.middleware.js";
import {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
const router = express.Router();

// 정보를 보낼때는 post로 보내주어야한다
// End point 별로 나누고 controller 설정해주기
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// Update-Profile
// Onl;y Authorized person can access this route
router.put("/update-profile", verifyToken, updateProfile);

router.get("/checkAuth", verifyToken, checkAuth);

export default router;
