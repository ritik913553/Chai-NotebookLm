import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        chatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        sender: { type: String, enum: ["user", "assistant"] },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Message = mongoose.model("Message", messageSchema);
