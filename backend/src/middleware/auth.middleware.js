const jwt =require('jsonwebtoken');
const User = require('../models/user.js');


const protectRoute=async(req,res,next)=>{
    try{
        const token =req.cookie.jwt;

        if(!token){
            return res.status(401).send("Unauthorized- No token Provided");

        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).send("Unauthorized- Invalid Provided");
        }
      
        const user=User.findById(decoded.userid).select("-password");
        if(!user){
            return res.status(404).send("User not found");
        }

        req.user=user;
        next();
        }catch(err){
        console.log("error in protectroute middleware");
    }






}

module.exports=protectRoute;