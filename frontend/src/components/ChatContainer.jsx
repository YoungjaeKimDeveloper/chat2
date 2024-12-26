import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";
import MessageSkeleton from "./skeletons/MessageSkeleton";

const ChatContainer = () => {
  const { isMessageLoading, messages, getMessages, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);
  console.log("=====================");
  console.log("SelectedUser", selectedUser._id);
  console.log("MESSAGES: ", messages);
  console.log("=====================");
  console.log("AUTH USER:", authUser);
  if (!isMessageLoading) {
    return (
      <div className="flex flex-col">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`chat ${
                message.senderid === authUser._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="size-10 rounded-xl border">
                <img
                  src={
                    message.senderid === authUser._id
                      ? authUser.profilePic || "../../public/avartar.png"
                      : selectedUser.profilePic || "../../public/avartar.png"
                  }
                  alt="profile-Pic"
                />
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs  opacity-50 ml-1">
                  {message.createAt}
                </time>
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <MessageInput />
      </div>
    );
  }
  return (
    <div>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4"></div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
