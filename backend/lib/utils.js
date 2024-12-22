import jwt from "jsonwebtoken";
// Token 발행해주고 cookie에 담아서 돌려주기
export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  if (token) {
    console.log(`TOKEN ISSUED COMPLETELY FROM Utilis file) ${token}`);
  }
  // COOKIE에 정보 담아서 내보내기
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prvent XSS attacks cross-site scripting attacks
    sameSite: "strict", // SCRF attacks cross-site request forgery attacks
    secure: process.env.NODE_ENV !== "development",
  });
  return token;
};
