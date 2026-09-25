const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite"
});

const askGemini = async (prompt) => {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;

      if (!error.message.includes("503")) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, attempt * 3000));
    }
  }

  throw lastError;
};

module.exports = { askGemini };