import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set) => ({
  // STATE
  messages: [],
  users: [],
  onlineUsers: [],
  selectedUser: null,
  // STATE - Loading
  isAuthLoading: false,
  isMessageLoading: false,
  isUsersLoading: false,
  // Action
  // ACTION -SET
  // TODO : OPTIMIZE THIS ONE LATER
  setSelectedUser: (user) => set({ selectedUser: user }),
  // ACTION - GET
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const responseFromServer = await axiosInstance.get("/message/users");
      console.log("FROM getUsers:  ", responseFromServer);
      set({ users: responseFromServer.data.users });
      toast.success("LOAD THE USERS LIST SUCCESSFULLY");
    } catch (error) {
      console.error("ERROR FROM -> getUsers", error.message);
      set({ isUsersLoading: false });
      toast.error(
        "FAILED TO LOAD USERS LIST",
        error?.resposne?.data?.message || "Failed to load users list"
      );
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (partnerID) => {
    set({ isMessageLoading: true });
    try {
      const responseFromServer = await axiosInstance.get(
        `/message/${partnerID}`
      );
      set({ messages: responseFromServer.data.messages });
      toast.success("SUCCEED IN GETTING MESSAGES");
      // 제발 로직 순서를 지킬것
    } catch (error) {
      console.error("ERROR IN ❗️getMessages❗️", error.message);
      toast.error("FAIL TO GET THE MESSAGES", error?.response?.data?.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
}));
