require("dotenv").config()
const passport = require("passport")
const userModel = require("../model/User")
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:"http://localhost:4000/auth/google/callback"
},async(accessToken,refreshToken,profile,done)=>{
   
    try {
        const existingUser = await userModel.findOne({googleId:profile.id})
        if(existingUser)return done(null,existingUser);
        const newUser = await userModel.create({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0].value,
        photo: profile.photos?.[0].value
    }) 
    done(null,newUser)
    } catch (error) {
        done(error,null)
    }
}))

passport.serializeUser((user,done)=>done(null,user.id))
passport.deserializeUser(async(id,done)=>{
    const user = await userModel.findById(id)
    done(null,user)
})

module.exports = passport