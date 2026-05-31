import express from "express";

import {
  registerUser,
  loginUser,
  logout
} from "../controllers/authController.js";


import authMiddleware from "../middleware/authMiddleware.js";
const authRouter = express.Router();


// Register Route

authRouter.post(
  "/register",
  registerUser
);


// Login Route

authRouter.post(
  "/login",
  loginUser
);

export default authRouter;

// Logout Route 

authRouter.post(
"/logout",
authMiddleware,
logout
);