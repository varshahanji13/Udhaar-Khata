import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import authRouter from "./routes/authRoutes.js";
import testRouter from "./routes/testRoutes.js";
import customerRouter from "./routes/customerRoutes.js";
import transactionRouter from "./routes/transactionRoutes.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import reportRouter from "./routes/reportRoutes.js";
import reminderRouter from "./routes/reminderRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/customers", customerRouter);
app.use("/api/transactions", transactionRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/reports", reportRouter);
app.use("/api/reminders", reminderRouter);

async function connectDB(){

try{

await mongoose.connect(process.env.MONGODB_URI);

console.log("Connected to the Database");

const port=
process.env.PORT || 5000;

app.listen(port,()=>console.log(`Server running on port ${port}`));

}
catch(error){

console.log("Database connection error:",error);

}

}

connectDB();