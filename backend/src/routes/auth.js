const express=require('express');
const {login,signup,logout,updateProfile,checkAuth}=require('../controllers/auth.controller.js');
const router=express.Router();
const protectRoute=require("../middleware/auth.middleware.js")

router.post("/login",login);
router.post("/signup",signup);
router.post("/logout", protectRoute,logout);

router.put("/update-profile",protectRoute,updateProfile);
router.get("/check",protectRoute,checkAuth);
module.exports=router;