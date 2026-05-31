import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customer",
      required: true
    },

    type: {
      type: String,
      enum: ["credit", "payment"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user"
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const TransactionModel = model("transaction", transactionSchema);