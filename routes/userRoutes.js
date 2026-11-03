import express from "express";
import { userRegister, verifyOTP } from "../controllers/userController.js";

const routers = express.Router();

routers.post("/register", userRegister);
routers.post("/verify-otp", verifyOTP);

export default routers;
