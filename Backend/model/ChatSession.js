const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema({
    chatUserId:{type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chatTitle:{
        type:String,
        default:"Untitled Chat"
    },
    chats:[
        {   
            chatId:{type:Number,required:true},
            question:{type:String,required:true},
            answer:{type:String,required:true},
            timestamp:{type:Date,default:Date.now}
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model("ChatSession",chatSessionSchema)