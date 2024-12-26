const cloudinary = require("cloudinary").v2;
const {config} = require('dotenv');

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:CLOUDINARY_API_KEY,
    api_secret:CLOUDINARY_API_SECRET,
    
    
});


module.exports = cloudinary;