const express = require("express");
const router = express.Router();
require("dotenv").config();

const { chatCompletion } = require("../helper/openaiApi");
const {
    sendMessage,
    setTypingOff,
    setTypingOn,
} = require("../helper/messengerApi");
const { chatGemini } = require("../helper/geminiApi");

router.get("/", (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (mode && token) {
        if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

router.post("/", async (req, res) => {
    try {
        let body = req.body;
        let senderId = body.entry[0].messaging[0].sender.id;
        let query = body.entry[0].messaging[0].message.text;
        await setTypingOn(senderId);
        let result;

        const startGem = query.startsWith("/gem");
        let prompt = query.slice(4).trim();
        if (startGem && prompt.length > 0) {
            result = await chatGemini(prompt);
        } else {
            result = await chatCompletion(query);
        }

        await sendMessage(senderId, result.response);
        await setTypingOff(senderId);
    } catch (error) {
        await sendMessage(
            senderId,
            "Something went wrong please ask again. :)"
        );
        await setTypingOff(senderId);
    }
    res.status(200).send("OK");
});

module.exports = {
    router,
};
