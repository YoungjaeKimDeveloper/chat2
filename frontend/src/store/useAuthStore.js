import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASEURL = "http://localhost:5010";

export const useAuthStore = create((set, get) => ({
  // STATE
  authUser: null,
  onlineUsers: [],
  socket: null,
  // STATE - LOADING
  isCheckngAuth: false,
  isSigningUp: false,
  isLoggining: false,
  isUpdatingProfile: false,

  // Socket Client's Part

  // ACTION
  checkAuth: async () => {
    try {
      set({ isCheckngAuth: true });
      const res = await axiosInstance.get("/auth/checkAuth");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      set({ isCheckngAuth: false });
    } finally {
      set({ isCheckngAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data.newUser });
      get().connectSocket();
      toast.success("Account created successfully");
    } catch (error) {
      set({ isSigningUp: false });
      set({ authUser: null });
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    try {
      const responseFormServer = await axiosInstance.post("/auth/login", data);

      set({ authUser: responseFormServer.data.user });
      get().connectSocket();
      toast.success("USER LOGGINED");
    } catch (error) {
      set({ authUser: null });
      console.error("FAILED TO LOGIM", error.message);
      toast.error("FAILED TO LOGIN");
    }
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("USER LOGGED OUT");
      get().disconnectSocket();
    } catch (error) {
      console.error("FAIL TO LOGOUT FROM : logout ", error.message);
      set({ authUser: null });
      toast.error("FAILED TO LOGOUT");
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      // 서버로 Request 보내고
      const res = await axiosInstance.put("/auth/update-profile", data);
      // 서버에서 Response 받아서 authUpdate
      set({ authUser: res.data.updateUser });
      toast.success("PROFILE UPDATED");
    } catch (error) {
      set({ isUpdatingProfile: false });
      console.error("ERROR IN : updateProfile", error.message);
      toast.error("FAILED TO UPDATE PROFILE", error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  // socket Function
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASEURL, {
      query: {
        userId: authUser._id,
      },
    });
    set({ socket: socket });

    socket.on("connect", () => {
      console.info("USER CONNECT TO SERVER!");
    });

    socket.on("getOnlineUsers", (onlineUsers) => {
      console.log("Online Users : getOnlineUsers", onlineUsers);
      set({ onlineUsers: onlineUsers });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
    }
  },
}));

// 1:53:03
