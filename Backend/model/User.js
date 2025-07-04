const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    googleId:{type:String,require:true,unique:true},
    name:String,
    email:String,
    photo:String
})

const userModel = mongoose.model("User",userSchema)

module.exports = userModel