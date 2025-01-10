const User =require("../models/user.js")
const Msg =require("../models/msg.js")
const cloudinary=require("cloudinary");

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

    }catch(err){
        return res.status(400).send("error in sending message");
    }
}

module.exports={sendMessages,getMessages,getUsersforSiderabar};