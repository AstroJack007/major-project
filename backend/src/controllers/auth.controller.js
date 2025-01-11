const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt.js");
const { profileEnd } = require("console");
const cloudinary= require("../lib/cloudinary.js");
const signup=async(req,res)=>{
    const {email,fullname,password} =req.body;
    try{
        if(!email || !fullname || !password){
            return res.status(400).send("Please fill all the fields");
        }
       
        if(password.length<6){
            return res.status(400).send("Password must be atleast 6 characters long");  }
            
            const user = await User.findOne({email});
            if(user){
                return res.status(400).send("User already exists with the same email")
            }
    
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            const newUser = new User({
                fullname:fullname,
                email:email,
                password:hashedPassword,
            })
            await newUser.save(); 

            if (newUser) {
                generateToken(newUser._id, res);
                
            }
            res.status(201).json({ message: "User created successfully" }); 
        }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error");
    }
}
const login=async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).send("Please fill all the fields");
    }
    try{
        const user = await User.findOne({email});
        
        if (!user) {
            return res.status(400).send("Invalid Email");
        }

        const iscorrect = await bcrypt.compare(password,user.password);
    
        if(!iscorrect){
            return res.status(400).send("Invalid Password"); 

        }  
        generateToken(user._id,res);
        res.status(200).json(user);
    }catch(err){
        console.log(err);
        res.status(500).send("Login failed");
    }

}

const logout=(req,res)=>{
    try{
        res.cookie("jwt","" ,{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    }catch(err){
        console.log(err);
        res.status(500).send("Logout Failed");
    }
}

const updateProfile=async(req,res)=>{
    try{
        const {profilepic}=req.body;
        const userId=req.user._id;

        if(!profilepic){
            return res.status(400).send("Please upload a profile picture"); 
        }

        const uploadresp= await cloudinary.uploader.upload(profilepic);
        const updatedUser=await User.findByIdAndUpdate(userId,{profilepic:uploadresp.secure_url},{new:true});


    }catch(err){
        console.log(Err);
        res.status(500).send("Internal Server Error in updating profile");
    }
}

const checkAuth = (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
     
      const { _id, fullname, email } = req.user;
     
      res.status(200).send({message:{ _id, fullname, email }});
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
module.exports={login,signup,logout,updateProfile,checkAuth};