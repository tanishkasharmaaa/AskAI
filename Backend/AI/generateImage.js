const { GoogleGenAI, Modality } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const { cloudinary } = require("../config/cloudinary");
require("dotenv").config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateImageFromPrompt(prompt) {
  const response = await genAI.models.generateContent({
    model: "gemini-2.0-flash-preview-image-generation",
    contents: prompt,
    config: {
      responseModalities: [Modality.TEXT, Modality.IMAGE],
    },
  });

  let description = "";
  let imageUrl = "";

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.text) {
      description = part.text;
    }

    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      const tempPath = path.join(__dirname, "temp.png");
      fs.writeFileSync(tempPath, buffer);

      const uploaded = await cloudinary.uploader.upload(tempPath, {
        folder: "AskAI_Images",
      });

      fs.unlinkSync(tempPath); // delete temp image

      imageUrl = uploaded.secure_url;
    }
  }

  return {
    description,
    imageData: imageUrl,
  };
}

module.exports = generateImageFromPrompt;
