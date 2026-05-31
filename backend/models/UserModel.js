import { Schema, model } from "mongoose";

// Create user schema with validations

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true
    },

    password: {
      type: String,
      required: [true, "Password is required"]
    },

    // for soft delete
    status: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw"
  }
);

// Create user model

export const UserModel = model("user", userSchema);