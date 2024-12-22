import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    senderid: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverid: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", MessageSchema);
