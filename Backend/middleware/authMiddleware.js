require("dotenv").config()
const jwt = require("jsonwebtoken");

function authMiddleware(req,res,next){
const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

if(!token)return res.status(401).send("Unauthorized. Token missing.");

try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.userId=decoded.id
    next()
} catch (error) {
    if(error.name==="TokenExpiredError"){
        return res.status(401).json({message:"Token expired. Please log in again."})
    }
    return res.status(401).send("Invaild Token")
}
}

module.exports = authMiddleware
