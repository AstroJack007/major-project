const express=require('express');
const protectRoute = require('../middleware/auth.middleware.js');
const { getUsersforSiderabar ,getMessages,sendMessages} = require('../controllers/message.controller.js');
const router=express.Router();

router.get("/user",protectRoute,getUsersforSiderabar);
router.get("/:id",protectRoute,getMessages);
router.post("/:id/send",protectRoute,sendMessages);
module.exports=router;