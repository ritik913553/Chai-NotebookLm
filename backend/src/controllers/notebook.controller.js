import { Chat } from "../models/chats.model.js";
import { Message } from "../models/messages.model.js";
import { handleUserMessage } from "../services/chatService.js";
import { handleDocumentUpload } from "../services/documentService.js";
import { promises as fs } from "fs";

const uploadSource = async (req, res) => {
    try {
        console.log("File uploaded:", req.file);
        const result = await handleDocumentUpload(req);

        // Remove uploaded file
        if (req.file) {
            await fs.unlink(req.file.path);
        }

        res.json(result);
    } catch (err) {
        if (req.file) {
            await fs.unlink(req.file.path);
        }
        console.log("Error in uploadSource:", err.message);
        res.status(500).json({ error: err.message });
    }
};

const chat = async (req, res) => {
    const { chatId, content } = req.body;
    const userId = req.user._id;
    if (!chatId || !content) {
        return res.status(400).json({ error: "Chat ID and content are required" });
    }
    
    try {
        const result = await handleUserMessage({ userId, chatId, content });
        res.json(result);
    } catch (err) {
        console.log("Error in chat:", err);
        res.status(500).json({ error: err.message });
    }
};
const getAllChat = async (req, res) => {
    const userId = req.user._id;
    try {
        const chats = await Chat.find({ userId });
        res.json(chats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllMessageOfPArticularChat = async (req, res) => {
    const chatId = req.params.id;
    try {
        const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { uploadSource, chat, getAllChat, getAllMessageOfPArticularChat };
