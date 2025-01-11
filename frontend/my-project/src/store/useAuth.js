import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { data } from "react-router-dom";
export const useAuth = create ((set) => ({  
    authUser:null,
    isSigningup:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    
    isCheckingAuth:true,

    checkAuth:async()=>{
    try {
        const res =await axiosInstance.get('auth/check');
        set({authUser:res.data})
    } catch (error) {
        console.log("error in checkauth : ",error
        )
        set({authUser:null})
    }
    finally{
        set({isCheckingAuth:false})
    }
    },

    signup:async(data)=>{
        set({isSigningup:true})
        try{
            const res= await axiosInstance.post('auth/signup',data);
            set({authUser:res.data});
            toast.success("Account created successfully");
            
        }catch(error){
            console.log("error in signup : ",error);
            toast.error(error.message);
        }finally{
            set({isSigningup:false})
        }
    },
    
    logout :async()=>{
        try{
            await axiosInstance.post('auth/logout');
            set({authUser:null});
            toast.success("Logged out successfully");
        }catch(error){
            toast.error(error.message);
        }
    },
    login :async(dat)=>{
        set({isLoggingIn:true});
        try{
            const res= await axiosInstance.post('auth/login',dat); 
            console.log("res.data : ",res.data);
            set({authUser:res.data});
            toast.success("Logged in successfully");    
            
        }catch(error){
            console.log("error in login : ",error);
            toast.error(error.message);
        }finally{
            set({isLoggingIn:false});
        }
    },
    updateProfile: async(data)=>{
        set({isUpdatingProfile:true})
        try{
            const res=await axiosInstance.put('auth/update-profile',data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        }catch(error){
            console.log("error in updateProfile : ",error);
          
            toast.error(error.message);
    
    }finally{
        set({isUpdatingProfile:false})
    }
}
}
));