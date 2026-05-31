import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { downloadStatement } from "../controllers/reportController.js";

const reportRouter = express.Router();


// Generate PDF (User spec: GET /reports/pdf/:customerId)

reportRouter.get(
  "/pdf/:customerId",
  authMiddleware,
  downloadStatement
);

export default reportRouter;