require("dotenv").config()
const jwt = require("jsonwebtoken")
const express = require("express");
const router = express.Router();
const passport = require("passport")
const authMiddleware = require("../middleware/authMiddleware")

router.get('/',(req,res)=>{
    res.send(`<a href="/auth/google">Login with Google</a>`)
})

router.get("/google",passport.authenticate('google',{scope:['profile','email']}))

router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),
(req,res)=>{
    const user = req.user;

    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn:"1d"
    })

    // Send token in HTTP-only cookie
    res.cookie("token",token,{
        httpOnly:true,
        secure:false,
        maxAge:24*60*60*1000
    })
    res.redirect("/auth/profile")
})

router.get("/profile",authMiddleware,(req,res)=>{
    res.send(`${req.user.id}`)
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token");
    req.logout(()=>{
        res.redirect("/auth")
    })
})

module.exports = router