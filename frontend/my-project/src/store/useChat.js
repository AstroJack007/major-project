import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuth } from "./useAuth.js";

export const useChat = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("message/user");

      set({ users: res.data });
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getmessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`message/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      toast.error(err.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser } = get();
    try {
      const res = await axiosInstance.post(
        `/message/${selectedUser._id}/send`,
        messageData
      );
       
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  },
  
  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },
  
  subscribeToMessages: () => {
    const socket = useAuth.getState().socket;
    const authUser = useAuth.getState().authUser;
    
    if (!socket || !authUser) {
        console.error("Socket or auth user not initialized");
        return;
    }

    socket.off("newMessage").on("newMessage", (newMessage) => {
        const { selectedUser } = get();
        
        const isRelevantMessage = 
            newMessage.senderId === selectedUser._id || 
            newMessage.senderId === authUser._id;
            
        if (isRelevantMessage) {
            set((state) => {
                // Check if message already exists
                const messageExists = state.messages.some(msg => msg._id === newMessage._id);
                if (messageExists) return state;
                
                return {
                    messages: [...state.messages, newMessage]
                };
            });
        }
    });
},
  unsubscribeToMessages: () => {
    const socket = useAuth.getState().socket;
    socket.off("newMessage");
  },
  
}));
