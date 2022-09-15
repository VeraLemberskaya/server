import { Schema, model } from "mongoose";

const UserPasswords = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  prevPasswords: {
    type: [String],
    required: true,
    default: [],
  },
});

export default model("UserPasswords", UserPasswords);
