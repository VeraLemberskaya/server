import { Schema, model } from "mongoose";

const Quiz = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  questions: [
    {
      _id: false,
      id: { type: Schema.Types.ObjectId, ref: "Question" },
      answers: [Schema.Types.ObjectId],
    },
  ],
  answers: { type: [Schema.Types.ObjectId], default: [] },
  score: { type: Number, default: 0 },
});

export default model("Quiz", Quiz);
