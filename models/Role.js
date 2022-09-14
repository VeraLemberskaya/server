import { Schema, model } from "mongoose";

const Role = new Schema({
  name: { type: String, unique: true, default: "USER" },
  permissions: { type: [String], required: true },
  versionKey: false,
});

export default model("Role", Role);
