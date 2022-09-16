import { Schema, model } from "mongoose";

const User = new Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: "Role" },
  isActivated: { type: Boolean, required: true, default: false },
  versionKey: false,
});

export default model("User", User);
