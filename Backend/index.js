
const express = require("express");
const passport = require("passport")
const session = require("express-session");
const connection = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors")

require("./config/passport")
require("dotenv").config();

const app = express()
app.use(cors({
    origin: "https://ask-ai-vgt6.vercel.app", 
  credentials: true }
))
app.use(cookieParser())
app.use(express.json())

app.use(session({
    secret:"google-secret",
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:false,
        maxAge:4*24*60*60*1000 // 4 day
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth",require("./routes/authRoute"))
app.use("/ai",require("./routes/ChatRoute"))
app.use("/ai/Image",require("./routes/imageRoute"))
app.use("/upload-edit",require("./routes/uploadAndEditImage"));


app.listen(process.env.PORT,async()=>{
    await connection()
    console.log(`Server is running at port ${process.env.PORT}`) 
})