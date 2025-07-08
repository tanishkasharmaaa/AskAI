const generate = require("../AI/generateText");
const ChatSession = require("../model/ChatSession");

const chat = async(req,res)=>{
const chatRoomId = req.params.id;
    const {prompt} = req.body
    if(!prompt || typeof prompt !=="string"){
        return res.status(400).json({error:"Prompt is required and must be a string"});
    }

    try {
    const existingChatRoom = await ChatSession.findById(chatRoomId.trim())
    if(!existingChatRoom)return res.status(400).json({message:`Chat room with id ${chatRoomId} not found`});

const lastChat = existingChatRoom.chats.at(-1);

const vagueKeywords = [
  "explain last topics",
  "previous topic",
  "its fetures",
  "list features",
  "explain it",
  "tell more about it",
  "what are its advantages",
  "expand on previous",
  "continue",
  "what are its benefits"
]

const isVague = vagueKeywords.some(keyword=>
  prompt.toLowerCase().includes(keyword)
);

const finalPrompt = isVague && lastChat
?`This previous topic was: ${lastChat.question}. Now ${prompt}`
:prompt;

   const result = await generate(finalPrompt);
   
    const chat = {
        chatId:Math.random(),
        question:prompt,
        answer:result.text
    }

    existingChatRoom.chats.push(chat);
    await existingChatRoom.save();
    res.status(200).json({
      message: "Chat added successfully",
      chatRoomId,
      updatedSession: existingChatRoom})
    } catch (error) {
        console.error("Error updating chat session:",error);
        res.status(500).json({error:"Failed to add chat to the session"})
    }
}

const deleteChat=async(req,res)=>{
const chatId = req.params.id
try {
    const findChatSession = await ChatSession.findById(chatId)
   findChatSession.chats = findChatSession.chats.filter((chat)=>chat.chatId!==req.params.chatId)
    await findChatSession.save()
    res.status(200).json({message:"Chat deleted Successfully"})

} catch (error) {
    console.error(error.message)
    res.status(500).json({message:"500 Internal Server error"})
}
}

const updateChat = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required and must be a string" });
  }

  try {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) {
      return res.status(400).json({ error: "Prompt cannot be empty" });
    }

    const result = await generate(trimmedPrompt); // Make sure it returns { text: "..." }

    const session = await ChatSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Chat session not found" });

    const chatToUpdate = session.chats.id(req.params.chatId);
    if (!chatToUpdate) return res.status(404).json({ message: "Chat not found" });

    chatToUpdate.question = trimmedPrompt;
    chatToUpdate.answer = result.text;

    await session.save();

    res.status(200).json({
      message: "Chat updated successfully",
      updatedChat: chatToUpdate
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


const displayAllChats = async(req,res)=>{
const chatId = req.params.id
try {
    const findChatSession = await ChatSession.findById(chatId)
    const findChat = findChatSession.chats
    
    res.status(200).json({chats:findChat})

} catch (error) {
    console.error(error.message)
    res.status(500).json({message:"500 Internal Server error"})
}
}


module.exports = {chat,deleteChat,updateChat,displayAllChats}