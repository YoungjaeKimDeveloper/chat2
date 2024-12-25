import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  // STATE
  authUser: null,
  // STATE - LOADING
  isCheckngAuth: false,
  isSigningUp: false,
  isLoggining: false,
  isUpdatingProfile: false,
  // ACTION

  checkAuth: async () => {
    try {
      set({ isCheckngAuth: true });
      const res = await axiosInstance.get("/auth/checkAuth");
      set({ authUser: res.data.user });
    } catch (error) {
      // console.error("ERROR IN checkAuth", error.message);
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
      console.log(responseFormServer);
      set({ authUser: responseFormServer.data.user });
      toast.success("USER LOGGINED");
    } catch (error) {
      set({ authUser: null });
      console.error("FAILED TO LOGIM", error.message);
      toast.error("FAILED TO LOGIN");
    }
  },
  logout: async () => {
    try {
      console.info("USER LOGGED OUT");
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("USER LOGGED OUT");
    } catch (error) {
      console.error("FAIL TO LOGOUT FROM : logout ", error.message);
      set({ authUser: null });
      toast.error("FAILED TO LOGOUT");
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      console.log(data);
      const res = await axiosInstance.put("/auth/update-profile", data);
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
}));

// 1:53:03
