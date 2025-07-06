const jwt = require("jsonwebtoken")
const ChatSession = require("../model/ChatSession");

const createChatRoom =async(req,res)=>{
const {title} = req.body;
try {
    const token = req.cookies.token||req.headers.authorization?.split(" ")[1];
    if(!token)return res.status(400).json({message:"Token not found"})
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const createChatRoom = await ChatSession.create({
        chatUserId:decoded.id,
        chatTitle:title
    })
    await createChatRoom.save()
    res.status(200).json({message:"Chat room created sucessfully"})
} catch (error) {
    console.error(error.message);
    res.status(500).json({message:"500 internal server error"})
}
}

const updateTitle = async(req,res)=>{
    const {title} = req.body;
try {
    const session = await ChatSession.findByIdAndUpdate(req.params.id,{chatTitle:title},{new:true})
    await session.save();
    res.status(200).json({message:"Chat Room title updated"})
} catch (error) {
    console.error(error.message)
    res.status(500).json({message:"500 Internal server error"})
}
}

const deleteChatSession =async(req,res)=>{
   try {
    const { id } = req.params;

  
    await ChatRoom.findByIdAndDelete(id);

    res.status(200).json({ message: "Chat room deleted successfully" }); // ✅ important
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Internal Server error" }); // only sent on error
  }
}

const displayChatRooms = async(req,res)=>{
try {
    const token = req.cookies.token||req.headers.authorization.split(" ")[1];
    if(!token)return res.status(400).json({message:"Token not found"});
    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const chatRooms = await ChatSession.find({chatUserId:decoded.id})
    res.status(200).json(chatRooms)
} catch (error) {
    console.error(error.message)
    res.status(500).json({error})
}
}

module.exports = {createChatRoom,updateTitle,deleteChatSession,displayChatRooms}