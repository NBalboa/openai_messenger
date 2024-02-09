require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const generationConfig = {
    stopSequences: ["red"],
    maxOutputTokens: 250,
    temperature: 0.9,
    topP: 0.1,
    topK: 16,
};

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function chatGemini(prompt) {
    try {
        const model = genAi.getGenerativeModel({
            model: "gemini-pro",
            generationConfig,
        });
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
