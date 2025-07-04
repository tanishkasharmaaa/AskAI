const mongoose = require("mongoose");
require("dotenv").config()

const connection =async()=>{
    try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log(`✅ Connected to Mongodb`)
    } catch (error) {
    console.log("❌ Mongodb connection failed",error.message)
    }
}

module.exports = connection