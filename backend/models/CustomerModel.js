import { Schema, model } from "mongoose";

const customerSchema = new Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name required"]
    },

    phoneNumber: {
      type: String,
      required: [true, "Phone number required"]
    },

    address: {
      type: String
    },

    currentBalance: {
      type: Number,
      default: 0
    },

    notes: {
      type: String
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },

    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const CustomerModel = model("customer", customerSchema);