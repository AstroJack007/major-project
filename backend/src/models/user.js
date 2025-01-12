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
        default: "https://res.cloudinary.com/dbqhxn9qm/image/upload/v1736697657/wyefa90kfrxx7lhcyu7a.png"
    },
},
{timestamps: true}
);

const User=mongoose.model('User',userSchema);

module.exports=User;