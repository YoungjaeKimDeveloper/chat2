import cloudinary from "../../lib/cloudinary.js";
import { Message } from "../../models/Message.js";
import { User } from "../../models/User.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      return res
        .status(400)
        .json({ success: false, message: "FAIL TO GET THE USERS" });
    }
    const users = await User.find({
      _id: {
        $ne: currentUser._id,
      },
    }).select("-password");
    if (!users) {
      return res
        .status(400)
        .json({ success: false, message: "FAIL TO GET USERS" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: partnerId } = req.params;
    const senderId = req.user._id;
    // Get the conversation
    const messages = await Message.find({
      $or: [
        { senderid: senderId, receiverid: partnerId },
        { senderid: partnerId, receiverid: senderId },
      ],
    });

    return res.status(200).json({ messages: messages });
  } catch (error) {
    console.error("ERROR IN getMessages: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "FAILED TO GET MESSAGES" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const currentUserID = req.user._id;
    const { id: partnerId } = req.params;
    const { text, image } = req.body;

    let imageUrl;

    if (image) {
      // image base64 image to cloudniary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = await Message.create({
      text: text,
      image: imageUrl,
      senderid: currentUserID,
      receiverid: partnerId,
    });

    // todo: realtime functionality goes here
    return res.status(201).json({ newMessage: newMessage });
  } catch (error) {
    console.error("ERROR IN sendMessage", error.message);
    return res.status(500).json({ message: "INTERNAL ERROR" });
  }
};
