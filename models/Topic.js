import { Schema, model } from "mongoose";

const Topic = new Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String, default: "" },
  selected: { type: Boolean, default: true },
  img: { type: String, default: "" },
});

export default model("Topic", Topic);
