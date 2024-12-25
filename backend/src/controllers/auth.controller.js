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
const login=(req,res)=>{
    res.send("signup");
}

const logout=(req,res)=>{
    res.send("signup");
}

module.exports={login,signup,logout};