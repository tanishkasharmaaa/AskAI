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
      chat})
    } catch (error) {
        console.error("Error updating chat session:",error);
        res.status(500).json({error:"Failed to add chat to the session"})
    }
}

const deleteChat=async(req,res)=>{
const chatId = req.params.id
try {
    const findChatSession = await ChatSession.findByIdAndDelete(chatId)
    const findChat = findChatSession.chats.filter((chat)=>chat.chatId!==req.params.chatId)
    await findChat.save()
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
    const result = await generate(prompt);
    const session = await ChatSession.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Chat session not found" });
    }

   
    const chatToUpdate = session.chats.id(req.params.chatId);

    if (!chatToUpdate) {
      return res.status(404).json({ message: "Chat not found in the session" });
    }

   
    chatToUpdate.question = prompt;
    chatToUpdate.answer = result.text;

   
    const updatedSession = await session.save();

    res.status(200).json({
      message: "Chat updated successfully",
      updatedChat: chatToUpdate, // Just the updated chat
      chatSession: updatedSession // Full session if needed
    });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "500 Internal Server Error" });
  }
};


module.exports = {chat,deleteChat,updateChat}