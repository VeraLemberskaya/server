import mongoose from "mongoose";
import ApiError from "../exceptions/ApiError.js";

import Question from "../models/Question.js";

class QuestionService {
  async getQuestions({ topicId, questionCount, answerCount }) {
    const questions = await Question.aggregate([
      {
        $project: {
          topicId: 1,
          title: 1,
          img: 1,
          correctAnswer: 1,
          answers: { $slice: ["$answers", answerCount] },
        },
      },
      { $match: { topicId: mongoose.Types.ObjectId(topicId) } },
      { $sample: { size: questionCount } },
    ]);

    if (!questions || !questions.length) {
      throw ApiError.badRequest("Failed to find questions by topic.");
    }

    return questions;
  }

  async getQuestionById(questionId, { answerCount }) {
    let question;

    if (answerCount) {
      question = await Question.findById(questionId, {
        answers: { $slice: answerCount },
      });
    } else {
      question = await Question.findById(questionId);
    }

    if (!question) {
      throw ApiError.badRequest("Question with such id doesn't exist.");
    }

    return { ...question._doc, answers: question.answers };
  }
}

export default new QuestionService();
