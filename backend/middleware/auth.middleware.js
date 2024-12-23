// 56:34
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
export const verifyToken = async (req, res, next) => {
  try {
    // 쿠키정보중 jwt를 불러옴
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ success: false, message: "NO TOKEN" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "INVALID TOKEN" });
    }

    const user = await User.findById({ _id: decoded.userId }).select(
      "-password"
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "CANNOT IFND THE USER" });
    }
    // User확인받고 req.user = user로 저장해주기
    req.user = user;
    next();
  } catch (error) {
    console.error("FAIL TO VERIFY TOKEN", error.message);
  }
};
// 56:3P
