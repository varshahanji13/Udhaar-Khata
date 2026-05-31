import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
addCustomer,
getCustomers,
getCustomerById,
updateCustomer,
deleteCustomer
}
from "../controllers/customerController.js";

const customerRouter = express.Router();


// Add customer

customerRouter.post(
  "/add",
  authMiddleware,
  addCustomer
);


// Get all customers (User spec: GET /customers)

customerRouter.get(
  "/",
  authMiddleware,
  getCustomers
);

// Get single customer

customerRouter.get(
"/:id",
authMiddleware,
getCustomerById
);


// Update customer

customerRouter.put(
"/:id",
authMiddleware,
updateCustomer
);


// Delete customer

customerRouter.delete(
"/:id",
authMiddleware,
deleteCustomer
);

export default customerRouter;