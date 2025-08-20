import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";
import { CSVLoader } from "@langchain/community/document_loaders/fs/csv";
import { RecursiveUrlLoader } from "@langchain/community/document_loaders/web/recursive_url";
import { PPTXLoader } from "@langchain/community/document_loaders/fs/pptx";
import { compile } from "html-to-text";
import { OpenAIEmbeddings } from "@langchain/openai";
import { QdrantVectorStore } from "@langchain/qdrant";
import { client, COLLECTION_NAME } from "../config/qdrantDB.config.js";
import OpenAI from "openai";
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";

import { File } from "../models/files.model.js";
import { Chat } from "../models/chats.model.js";

const openai = new OpenAI();

const handleDocumentUpload = async (req) => {
    const { type, text, url ,youtubeUrl} = req.body;
    const userId = req.user._id;

    if (!type || !["text", "url", "pdf", "docx", "csv","youtubeUrl","pptx"].includes(type)) {
        throw new Error("Invalid or missing type");
    }

    let docs = [];

    // 1️⃣ Create File record in Mongo
    const file = await File.create({
        userId,
        name: req.file?.originalname || url || "text-input",
        type,
    });

    // 2️⃣ Create Chat record in Mongo
    const chat = await Chat.create({
        userId,
        fileId: file._id,
        title: `Chat for ${file.name}`,
    });

    // 3️⃣ Load docs depending on type
    if (type === "text") {
        docs = [
            {
                pageContent: text,
                metadata: {
                    user_id: userId,
                    file_id: file._id,
                    chat_id: chat._id,
                },
            },
        ];
    } else if (type === "url") {
        const compiledConvert = compile({ wordwrap: 130 });
        const loader = new RecursiveUrlLoader(url, {
            extractor: compiledConvert,
            maxDepth:1,
            excludeDirs: ["/docs/api/"],
        });
        docs = (await loader.load()).map((d) => ({
            ...d,
            metadata: {
                ...(d.metadata || {}),
                user_id: userId,
                file_id: file._id,
                chat_id: chat._id,
            },
        }));
    } else if (type === "youtubeUrl") {
        const loader = YoutubeLoader.createFromUrl(youtubeUrl, {
            language: "en",
            addVideoInfo: true,
        });
        docs = (await loader.load()).map((d) => ({
            ...d,
            metadata: {
                ...(d.metadata || {}),
                user_id: userId,
                file_id: file._id,
                chat_id: chat._id,
            },
        }));
    } else if (type === "pdf") {
        const loader = new PDFLoader(req.file.path);
        docs = (await loader.load()).map((d) => ({
            ...d,
            metadata: {
                ...(d.metadata || {}),
                user_id: userId,
                file_id: file._id,
                chat_id: chat._id,
            },
        }));
    } else if (type === "docx") {
        const loader = new DocxLoader(req.file.path);
        docs = (await loader.load()).map((d) => ({
            ...d,
            metadata: {
                ...(d.metadata || {}),
                user_id: userId,
                file_id: file._id,
                chat_id: chat._id,
            },
        }));
    } else if (type === "csv") {
        const loader = new CSVLoader(req.file.path);
        docs = (await loader.load()).map((d) => ({
            ...d,
            metadata: {
                ...(d.metadata || {}),
                user_id: userId,
                file_id: file._id,
                chat_id: chat._id,
            },
        }));
    }else if(type === "pptx") {
        const loader = new PPTXLoader(req.file.path);
        docs = (await loader.load()).map((d) => ({
            ...d,
            metadata: {
                ...(d.metadata || {}),
                user_id: userId,
                file_id: file._id,
                chat_id: chat._id,
            },
        }));
    }
     else {
        throw new Error("Unsupported file type");
    }

    // Generate embediings of file
    const embeddings = new OpenAIEmbeddings({
        model: "text-embedding-3-large",
    });

    // Store it in the qdrant DB
    await QdrantVectorStore.fromDocuments(docs, embeddings, {
        client,
        collectionName: COLLECTION_NAME,
    });

    // Generating Summary and title of the chat based on data

    const combinedText = docs
        .slice(0, 5)
        .map((d) => d.pageContent)
        .join("\n\n");

    const SYSTEM_PROMPT = `
        You are an expert ai assistant that generates short summary and concise chat title(title must be short doest not excedd to 16letters) and also 2 similar questions  for the uploaded document."
    `;
    const response = await openai.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: `Here is the document content:\n\n${combinedText}\n\nReturn JSON with fields 'summary' ,'similarQuestions' and 'title'.
                similarQuestions should be an array of 2 questions that are similar to the content of the document.
                `,
            },
        ],
    });

    const assistantMessage = response.choices[0].message.content;
    const { summary, title, similarQuestions } = JSON.parse(assistantMessage);

    await Chat.updateOne(
        { _id: chat._id },
        {
            $set: {
                summary: summary || "",
                title: title || "",
                similarQuestions: similarQuestions || [],
            },
        }
    );

    return {
        success: true,
        message: "Document stored successfully",
        fileId: file._id,
        chat,
    };
};

export { handleDocumentUpload };
