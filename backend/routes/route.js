import express from "express";
import {
  registerUser,
  loginUser,
 
} from "../controller/authController.js";
import { getMe, logoutUser } from "../controller/authController.js";
import { protect } from "../authmiddleware/middleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser);
router.get("/get-me",protect,getMe)

export default router;