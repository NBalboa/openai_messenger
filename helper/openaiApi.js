const { response } = require("express");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const chatCompletion = async (prompt) => {
    try {
        let messages = [];
        let content = prompt.trim();

        // Check if prompt contains "/ai"
        if (content.startsWith("/ai") && content.length) {
            // Split the prompt by "/ai"
            const parts = content.split("/ai").map((part) => part.trim());

            // Check if there's a message after "/ai"
            if (parts.length === 2 && parts[1] !== "") {
                // Add the message to messages
                messages.push({
                    role: "user",
                    content: parts[1],
                });
                content = parts[1];

                // Add system message
                messages.unshift({
                    role: "system",
                    content: "You are a helpful assistant.",
                });

                const response = await openai.chat.completions.create({
                    messages,
                    model: "gpt-3.5-turbo-0125",
                    temperature: 0.8,
                });

                content = response.choices[0].message.content;
                console.log(content);
                return {
                    status: 1,
                    response: content,
                };
            } else {
                // If no message after "/ai", ignore the prompt
                return {
                    status: 0,
                    response: "No message provided after /ai.",
                };
            }
        } else {
            // If prompt doesn't contain "/ai", ignore it
            return {
                status: 0,
                response: "Prompt does not contain /ai.",
            };
        }
    } catch (error) {
        if (error?.status === 429) {
            return {
                status: 0,
                response: "Please check OpenAI API key.",
            };
        } else {
            return {
                status: 0,
                response: "Invalid Input. Input must be a text",
            };
        }
    }
};

module.exports = {
    chatCompletion,
};
