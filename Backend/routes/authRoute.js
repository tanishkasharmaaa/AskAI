require("dotenv").config()
const jwt = require("jsonwebtoken")
const express = require("express");
const router = express.Router();
const passport = require("passport")
const authMiddleware = require("../middleware/authMiddleware");
const userModel = require("../model/User");

router.get('/',(req,res)=>{
    res.send(`<a href="/auth/google">Login with Google</a>`)
})

router.get("/google",passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),
(req,res)=>{
    const user = req.user;

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:"4d"
    })

    // Send token in HTTP-only cookie
    res.cookie("token",token,{
        httpOnly:true,
        secure:true,
        sameSite:"None",
        maxAge:24*60*60*1000
    })
    res.redirect("http://localhost:5173/textgen")
})

router.get("/profile", async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("name email photo");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ name: user.name, email: user.email,photo:user.photo });

  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});
router.get("/logout",(req,res)=>{
    res.clearCookie("token");
    req.logout(()=>{
        res.redirect("/auth")
    })
})

module.exports = router