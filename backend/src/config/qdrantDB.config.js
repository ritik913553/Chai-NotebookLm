import {QdrantClient} from '@qdrant/qdrant-js';

export const VECTOR_SIZE = 1536;
export const COLLECTION_NAME = "user_documents";

export const client = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});


export const ensureQdrantSetup = async () => {
 

  // 2️⃣ Create indexes for fields you want to filter on
  await client.createPayloadIndex(COLLECTION_NAME, {
    field_name: "metadata.user_id",
    field_schema: "keyword",
  });

  await client.createPayloadIndex(COLLECTION_NAME, {
    field_name: "metadata.chat_id",
    field_schema: "keyword",
  });

  console.log("Qdrant collection & indexes are ready ✅");
};