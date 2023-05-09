import { Schema, model } from "mongoose";

const Session = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz" },
});

export default model("Session", Session);
