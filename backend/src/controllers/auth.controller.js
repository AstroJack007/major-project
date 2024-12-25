const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/jwt.js");
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
        res.status(200).json({message:"Login Successful"});
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

module.exports={login,signup,logout};