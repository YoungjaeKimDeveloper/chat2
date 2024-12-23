import cloudinary from "../../lib/cloudinary.js";
import { generateToken } from "../../lib/utils.js";
import { User } from "../../models/User.js";
import bcrypt from "bcryptjs";

// 회원가입 기능을 의미하는것임
export const signup = async (req, res) => {
  // Signup 을 한다는것은 User Document 안에 새로운 Data를 만드는것을 의미함
  // 회원가입 완료!
  // 예외 되는 케이스 항상 먼저 뺴주기
  const { email, fullName, password } = req.body;
  if (!email || !fullName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "PLEASE FILL UP THE ALL FORMS" });
  }
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, message: "Password should be over 6 letters" });
    }
    // 기존 유저 찾아주기
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.status(409).json({ message: "Email Existed" });
    } else {
      // auth를 위해 토큰 발행해주기

      const hashPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, fullName, password: hashPassword });
      generateToken(newUser._id, res);
      await newUser.save();
    }

    return res.status(201).json({
      success: true,
      message: "Succeed to create new User",
      newUser: {
        email,
        fullName,
      },
    });
  } catch (error) {
    console.error("ERROR DURING CREATING USER", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to create new User INTERNAL SERVER ERROR",
    });
  }
};
// Document 에서 info 찾아서 보여주기
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "PLEASE FILL UP THE ALL FORM" });
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "CANNOT FIND THE USER WITH EMAIL" });
  }
  //   Hash뒤에 나오는게 DB에 저장되어있는것읋 의미함
  const isMatching = await bcrypt.compare(password, user.password);
  if (!isMatching) {
    return res
      .status(400)
      .json({ success: false, message: "PASSWORD DOESN'T MATCH" });
  }
  generateToken(user.id, res);
  return res.status(200).json({ user: user });
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    return res.json({ message: "logout Successfully" });
  } catch (error) {
    console.log("FAILED TO LOGOUT", error.message);
    return res.status(400).json({ message: "FAILED TO LOGOUT" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userID = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
    // 사진 cloudinary에 올려주기
    const result = await cloudinary.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userID,
      { profilePic: result.secure_url },
      { new: true }
    );
    return res.status(200).json({ success: true, updateUser });
  } catch (error) {
    console.error("ERROR IN UPDATE PROFILE", error.message);
    return res
      .status(500)
      .json({ message: "INTERNAL SERVER ERROR FROM = [updateProfile]" });
  }
};
export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    console.error("ERROR IN checkAuth: ", error.message);
    return res.status(400).json({ message: "FAILED TO CHECK AUTH" });
  }
};
