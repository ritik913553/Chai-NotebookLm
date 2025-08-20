import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route('/me').get(verifyJWT, (req, res) => {
  res.json(req.user);
});

export default router;
