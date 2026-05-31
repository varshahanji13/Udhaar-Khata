import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

const testRouter = express.Router();

testRouter.get(
  "/profile",
  authMiddleware,
  (req, res) => {

    res.json({
      message: "Protected Route Accessed",
      user: req.user
    });

  }
);

export default testRouter;