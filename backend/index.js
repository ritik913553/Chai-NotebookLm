import "dotenv/config";
import { app } from "./src/app.js";
import connectDB from "./src/config/mongoDB.config.js";
import { ensureQdrantSetup } from "./src/config/qdrantDB.config.js";
import path from "path";
import express from "express";

ensureQdrantSetup()
    .then(() => {
        console.log("Qdrant setup completed successfully.");
    })
    .catch((err) => {
        console.error("Error setting up Qdrant:", err);
    });



// -------------------code for deployment -------------------------
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static("./fronted/dist"));
  app.get("", (req, res) => {
    res.sendFile(path.resolve(dirPath, "./fronted/dist", "index.html"));
  });
}



    
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db conneection failed !!!", err);
    });
