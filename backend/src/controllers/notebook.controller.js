import { OpenAIEmbeddings } from "@langchain/openai";
import { Chat } from "../models/chats.model.js";
import { Message } from "../models/messages.model.js";
import { QdrantVectorStore } from "@langchain/qdrant";
import { handleUserMessage } from "../services/chatService.js";
import { handleDocumentUpload } from "../services/documentService.js";
import { client, COLLECTION_NAME } from "../config/qdrantDB.config.js";
import { promises as fs } from "fs";

const uploadSource = async (req, res) => {
    try {
        
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
        return res
            .status(400)
            .json({ error: "Chat ID and content are required" });
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
const getAChat = async (req, res) => {
    const chatId = req.params.id;
    try {
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const deleteChatById = async (req, res) => {
    try {
        const chatId = req.params.id;
        const userId = req.user._id;

        const chat = await Chat.findOne({ _id: chatId, userId });
        if (!chat) {
            return res.status(404).json({ error: "Chat not found" });
        }
        await Message.deleteMany({ chatId });
        await Chat.findByIdAndDelete(chatId);

        const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-large",
        });

        const vectorStore = await QdrantVectorStore.fromExistingCollection(
            embeddings,
            {
                client,
                collectionName: COLLECTION_NAME,
            }
        );
        await vectorStore.delete({
            filter: {
                must: [{ key: "metadata.chat_id", match: { value: chatId } }],
            },
        });
        res.json({
            message: "Chat and associated messages deleted successfully",
        });
    } catch (error) {
        console.log("Error in deleteChatById:", error.message);
        res.status(500).json({ error: "Failed to delete chat" });
    }
};

export {
    uploadSource,
    chat,
    getAllChat,
    getAllMessageOfPArticularChat,
    getAChat,
    deleteChatById,
};
