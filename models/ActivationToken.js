import { Schema, model } from "mongoose";

const ActivationToken = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
  activationToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 900,
  },
});

export default model("ActivationToken", ActivationToken);
