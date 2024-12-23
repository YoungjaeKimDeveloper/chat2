import mongoose, { Schema } from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    image: {
      type: String,
    },
    senderid: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverid: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", MessageSchema);
