import "dotenv/config";
import { app } from "./src/app.js";
import connectDB from "./src/config/mongoDB.config.js";
import { ensureQdrantSetup } from "./src/config/qdrantDB.config.js";

ensureQdrantSetup()
    .then(() => {
        console.log("Qdrant setup completed successfully.");
    })
    .catch((err) => {
        console.error("Error setting up Qdrant:", err);
    });




    
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(` Server is running at port : ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db conneection failed !!!", err);
    });
