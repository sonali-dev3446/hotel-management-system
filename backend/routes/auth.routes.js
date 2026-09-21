import express from 'express';
// import * as authController   from '../controllers/auth.controller.js';
import { register, login, profile } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const authRouter = express.Router();
authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/profile", authMiddleware, profile); 


export default authRouter;