import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";


export const useAuth = create((set, get) => ({
    authUser: null,
    isSigningup: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    socket: null,
    isCheckingAuth: true,
    onlineUser:[],
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('auth/check');
            console.log("res.data",res.data);
            const userData = res.data.message || res.data;
            set({ 
                authUser: userData,
                isCheckingAuth: false 
            });
            get().connectSocket();
        } catch (error) {
            console.log("error in checkauth : ", error);
            set({ 
                authUser: null,
                isCheckingAuth: false 
            });
        }
    },

    signup: async (data) => {
        set({ isSigningup: true });
        try {
            const res = await axiosInstance.post('auth/signup', data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            console.log("error in signup : ", error);
            toast.error(error.response.data);
        } finally {
            set({ isSigningup: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('auth/login', data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            console.error("Login error:", error);
            // Display error message from the backend or a default message
            toast.error(
                error.response?.data || 
                error.message || 
                "Login failed. Please check your credentials."
            );
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('auth/logout');
            set({ authUser: null });
            toast.success("Logged out successfully");
            get().disconnectSocket();
        } catch (error) {
            console.log("error in logout : ", error);
            toast.error(error.response.data);
        }
    },

    updateProfile: async (data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('auth/update-profile', data);
            if (res.data) {
                set({ authUser: res.data });
                toast.success("Profile updated successfully");
            } else {
                throw new Error("No data received from server");
            }
        } catch (error) {
            console.error("Error in updateProfile:", error);
            toast.error(error.response?.data || "Failed to update profile");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
    
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            },
            withCredentials: true,
            transports: ['websocket', 'polling']
        });
    
        socket.on("connect", () => {
            console.log("Socket connected");
        });
    
        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
        });
    
        set({ socket });
    
        socket.on("getOnlineUser", (userIds) => {
            set({ onlineUser: userIds });
        });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
            set({ socket: null });
        }
    }
}));
