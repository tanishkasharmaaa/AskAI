const express = require("express");
const generate = require("../AI/generateText");
const authMiddleware = require("../middleware/authMiddleware");
const jwt = require("jsonwebtoken")
const ChatSession = require("../model/ChatSession");
const { chat, deleteChat, updateChat } = require("../controllers/chats");
const { createChatRoom, updateTitle, deleteChatSession, displayChatRooms } = require("../controllers/chatRoom");

const router = express.Router();

router.post("/createChatRoom",authMiddleware,createChatRoom)
router.patch("/chat/:id",authMiddleware,chat)
router.delete("/chat/:id/:chatId",authMiddleware,deleteChat)
router.patch("/updateChat/:id/:chatId",authMiddleware,updateChat)
router.patch("/updateTitle/:id",authMiddleware,updateTitle)
router.delete("/deleteChatRoom/:id",authMiddleware,deleteChatSession)
router.get("/chat",authMiddleware,displayChatRooms)

module.exports = router;
