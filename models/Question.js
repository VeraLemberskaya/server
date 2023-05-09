import { Schema, model } from "mongoose";

const Answer = {
  value: { type: String, required: true },
};

const Question = {
  topicId: { type: Schema.Types.ObjectId, required: true, ref: "QuizTopic" },
  title: { type: String, required: true },
  answers: { type: [Answer], required: true },
  img: { type: String, default: "" },
  correctAnswer: {
    type: Schema.Types.ObjectId,
    required: true,
  },
};

export default model("Question", Question);
