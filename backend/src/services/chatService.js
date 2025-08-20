import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { client, COLLECTION_NAME } from "../config/qdrantDB.config.js";
import { ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";
import { Message } from "../models/messages.model.js";
import { Chat } from "../models/chats.model.js";

const openai = new OpenAI();

// 🔹 Core chat service
const handleUserMessage = async ({ userId, chatId, content }) => {
    // 1️⃣ Save user message
    const userMessage = await Message.create({
        userId,
        chatId,
        sender: "user",
        content,
    });

    // 2️⃣ Convert query into embedding
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

    // 3️⃣ Search Qdrant for relevant docs (restricted by user + chat)
    const filter = {
        must: [
            { key: "metadata.user_id", match: { value: userId } },
            { key: "metadata.chat_id", match: { value: chatId } },
        ],
    };
    const results = await vectorStore.similaritySearch(content, 3, filter);

    // Build context text from results
    const context = results.map((r) => r.pageContent).join("\n\n");

    const SYSTEM_PROMPT = `
        You are a helpful assistant. Use the following context from the user's document(s) to answer their question. Also generate the 2 most similar questions. 
        If context is missing, say you don't know.

        Context:
        ${context}

        Rules:
        1. Always answer based on the provided context.
        2. If the context does not provide enough information, say "It is not clear from the provided context."
        3. Always return a JSON object with fields 'answer' and 'similarQuestions'.
        4. For **bold text**, wrap with <b>...</b>.
        5. For links, always return valid HTML anchor tags, e.g. <a href="https://www.youtube.com/@piyushgargdev" target="_blank">Piyush Garg</a>.
        6. If the answer includes code, format it with <pre><code> ... </code></pre>.
        7. Do not include explanations outside of JSON.

        Example response:
        {
        "answer": "Here is an <b>important</b> point. You can also check <a href='https://www.youtube.com/@piyushgargdev' target='_blank'>Piyush Garg</a>. For code:\n<pre><code>console.log('Hello World');</code></pre>",
        "similarQuestions": [
            "What is the main topic of the document?",
            "How does this relate to the user's question?"
        ]
        }
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: content },
        ],
    });

    // 4️⃣ Save assistant message
    const data = response.choices[0].message.content;

    const { answer, similarQuestions } = JSON.parse(data);
    console.log("Similar Questions:", similarQuestions);
    // 5️⃣ Save assistant message
    const assistantMessage = await Message.create({
        userId,
        chatId,
        sender: "assistant",
        content: answer,
    });
    const chat = await Chat.updateOne(
        { _id: chatId },
        {
            $set: {
                similarQuestions: similarQuestions || [],
            },
        }
    );

    // 6️⃣ Return both
    return {
        userMessage,
        assistantMessage,
    };
};

export { handleUserMessage };
