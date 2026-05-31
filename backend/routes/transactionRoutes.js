import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
addTransaction,
getTransactions,
getAllTransactions
}
from "../controllers/transactionController.js";

const transactionRouter=
express.Router();


// Add transaction

transactionRouter.post(
"/add",
authMiddleware,
addTransaction
);


// Get all transactions (User spec: GET /transactions)
transactionRouter.get(
  "/",
  authMiddleware,
  getAllTransactions
);

// Get transaction history for specific customer
transactionRouter.get(
  "/:customerId",
  authMiddleware,
  getTransactions
);

export default transactionRouter;