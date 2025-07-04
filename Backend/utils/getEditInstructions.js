// utils/getEditInstructions.js
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getEditInstructions(prompt) {
  const response = await genAI.models.generateContent({
    model: "models/gemini-1.5-flash",
    contents: `You are an image editing assistant. Given the user's prompt "${prompt}", return a list of editing operations in this format:

grayscale, resize 512x512, blur, rotate 90, flip, brightness 1.2, contrast 0.8, add text 'My Photo'

Only return comma-separated instructions with parameters. No explanation.`,
  });

  const instruction =
    response?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "";

  return instruction;
}

module.exports = getEditInstructions;
