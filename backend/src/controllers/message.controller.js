const User =require("../models/user.js")
const Msg =require("../models/msg.js")
const cloudinary=require("cloudinary");
const { getReceiverSocketId ,io} = require("../lib/socket.js");

const getUsersforSiderabar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id;
       
        const filterUsers= await User.find({_id : {$ne:loggedInUserId}}).select("-password");
      
        res.status(200).json(filterUsers);

    }catch(err){
        console.log("error in getUsersforSidebar : " ,err.mesaage);
    }

}

const getMessages= async(req,res)=>{
    try {
        const {id:seconduserid}=req.params;
        const myId=req.user._id;

        const messages =await Msg.find({
            $or:[
                {senderId:myId ,receiverId:seconduserid},
                {senderId:seconduserid,receiverId:myId}
            ]

        })

        res.status(200).json(messages);
    } catch (err) {
        console.log("error in getting messages : " ,err.mesaage);
    }
}

const sendMessages=async(req,res)=>{
    try{
        const {text,image} = req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;
        let imageUrl;               
        if(image){
            const uploadResp= await cloudinary.uploader.upload(image);
            imageUrl=uploadResp.secure_url;
        }else{
            imageUrl=null;
        }

        const newmessage = new Msg({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        }) 

        await newmessage.save();
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newmessage)
        }
        const senderSocketId = getReceiverSocketId(senderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("newMessage", newmessage);
        }

        res.status(201).json(newmessage);
    }catch(err){
        console.error("Error in sendMessages:", err);
        return res.status(400).json({message: "error in sending message"});
    }
}

module.exports={sendMessages,getMessages,getUsersforSiderabar};