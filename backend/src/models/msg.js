const mongoose = require('mongoose');
const { type } = require('os');

const msgSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },

    receiverId:{    
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },  

    text:{
        type:String,    
        required: function() {
            return !this.image; // text is required only if there's no image
        },
    },
    image:{
        type:String,
    }

},{timestamps:true});

const Msg=mongoose.model('Msg',msgSchema);  

module.exports=Msg;
