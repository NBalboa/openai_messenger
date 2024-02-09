require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatGemini(prompt) {
    try {
        const model = genAi.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        return {
            status: 1,
            response: text,
        };
    } catch (e) {
        return {
            status: 0,
            response: e,
        };
    }
}

module.exports = { chatGemini };
