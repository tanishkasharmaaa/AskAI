const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function generate(prompt) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // ✅ Proper format
  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt  // ✅ this is required
          }
        ]
      }
    ]
  });

  const response = await result.response;
  const text = response.text();

  return { success: true, text };
}

module.exports = generate;
