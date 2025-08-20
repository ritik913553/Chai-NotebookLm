import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "File",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        summary: {
            type: String,
        },
        similarQuestions: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Chat = mongoose.model("Chat", chatSchema);
