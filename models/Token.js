import { Schema, model } from "mongoose";

const Token = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 900,
  },
});

export default model("Token", Token);
