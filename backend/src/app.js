import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: "isdfhnoifjnoi3294832",
    resave: false,
    saveUninitialized: false,
  })
);


// -------------------code for deployment -------------------------
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static("./fronted/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(dirPath, "./fronted/dist", "index.html"));
  });
}




import authRouter from "./routes/auth.routes.js";
import notebookRouter from "./routes/notebook.routes.js";

// routes declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/notebook", notebookRouter);


export { app };
