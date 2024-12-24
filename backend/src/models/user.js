const { profile } = require('console');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    profilepic: {
        type: String,
        default: "https://res.cloudinary.com/djzjepmnr/image/upload/v1632732898/blank-profile-picture-973460_640_vz6z0l.png"
    },
},
{timestamps: true}
);

const User=mongoose.model('User',userSchema);

module.exports=User;