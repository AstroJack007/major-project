import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL =  import.meta.env.MODE === "development"?"http://localhost:3000" : "http://52.66.244.205:3000/api";

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
        console.log("inside login");
        try {
            const res = await axiosInstance.post('auth/login', data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            console.log('Full error object:', error); // Log the full error
            console.log('Error response:', error.response); // Log the error response if any
            console.log('Error request:', error.request); // Log the error request if any
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
            const res = await axiosInstance.put('users/update', data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in updateProfile : ", error);
            toast.error(error.response.data);
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const {authUser}=get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            }
        });
        socket.on("connect");
        set({ socket });
        socket.on("getOnlineUser",(userIds)=>{
            set({onlineUser:userIds});
        })
        
    },

    disconnectSocket: () => {
        if (get().socket?.connected) {
            get().socket.disconnect();
            set({ socket: null });
        }
    }
}));
