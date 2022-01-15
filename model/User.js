//we gonna create a schema that represent  our model of The users

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    password: {
      type: String,
      required: true,
      min: 3,
      max: 30,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export { User };
