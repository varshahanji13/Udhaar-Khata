import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { sendReminder } from "../controllers/reminderController.js";

const reminderRouter=
express.Router();

reminderRouter.post(

"/:customerId",

authMiddleware,

sendReminder

);

export default reminderRouter;