import { Router } from "express";
import {
  uploadSource,
  chat,
  getAllChat,
  getAllMessageOfPArticularChat
} from "../controllers/notebook.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/upload").post(verifyJWT,upload.single("file"),uploadSource);
router.route("/upload/chat").post(verifyJWT,chat);
router.route("/chats").get(verifyJWT,getAllChat);
router.route("/chats/messages/:id").get(verifyJWT,getAllMessageOfPArticularChat);


export default router;
