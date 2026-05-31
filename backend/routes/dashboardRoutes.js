import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { getDashboardData } from "../controllers/dashboardController.js";

const dashboardRouter=
express.Router();

dashboardRouter.get(
"/",
authMiddleware,
getDashboardData
);

export default dashboardRouter;