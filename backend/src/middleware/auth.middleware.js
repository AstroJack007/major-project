const jwt =require('jsonwebtoken');
const User = require('../models/user.js');


const protectRoute=async(req,res,next)=>{
    try{
        const token =req.cookies.jwt;

        if(!token){
            return res.status(401).send("Unauthorized- No token Provided");

        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).send("Unauthorized- Invalid Provided");
        }
     
        const user=await User.findById(decoded.userid).select('_id fullname email');
        if(!user){
            return res.status(404).send("User not found");
        }
        req.user=user;
        
        next();
        }catch(err){
            console.log(err);
       
    }






}

module.exports=protectRoute;