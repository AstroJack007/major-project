import {create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios.js';

export const useChat=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,
    
    getUsers:async()=>{
        set({isUsersLoading:true});
        try{
            const res=await axiosInstance.get('message/user');
            console.log("Fetched users:", res.data);
            set({users:res.data});
        }catch(err){
            toast.error(err.message);
        }finally{
            set({isUsersLoading:false});
        }
    },
    getmessages:async(userId)=>{
        set({isMessagesLoading:true});
        try{
            const res=await axiosInstance.get(`message/${userId}`);
            set({messages:res.data});
        }catch(err){
            toast.error(err.message);
        }finally{
            set({isMessagesLoading:false});
        }
    },
 
    
 
sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
        const res = await axiosInstance.post(`/message/${selectedUser._id}/send`, messageData);
        set({ messages: [...messages, res.data] });
        return true;
    } catch (err) {
        toast.error(err.message);
        return false;
    }
},
    setSelectedUser:(selectedUser)=>{
        set({selectedUser});

    },
}))