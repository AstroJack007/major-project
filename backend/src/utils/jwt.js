const { sign } = require("crypto")
const jwt=require("jsonwebtoken")

const generatetoken=(userid,res)=>{
    const token= jwt.sign({userid},process.env.JWT_SECRET,{
        expiresIn:"7d"
    }
)

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=="development",
    })

}

module.exports=generatetoken;