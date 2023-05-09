import mongoose from "mongoose";

import ApiError from "../exceptions/ApiError.js";
import Topic from "../models/Topic.js";

import QuestionDto from "../dto/QuestionDto.js";
import QuizScoreDto from "../dto/QuizScopeDto.js";

import QuestionService from "./questionService.js";
import SettingService from "./settingService.js";
import Quiz from "../models/Quiz.js";
import Session from "../models/Session.js";
import { shuffleAnswers } from "../utils/shuffleAnswers.js";
import { mapAnswers } from "../utils/mapAnswers.js";
import QuizDto from "../dto/QuizDto.js";

class QuizService {
  async getQuiz({ topicId, userId }) {
    const topic = await Topic.findById(topicId);

    if (!topic) {
      throw ApiError.badRequest("Quiz topic with such id doesn't exist.");
    }

    const settings = await SettingService.getSettings();

    const {
      questionCount: { selected: questionCount },
      answerCount: { selected: answerCount },
    } = settings;

    const questions = await QuestionService.getQuestions({
      topicId,
      questionCount,
      answerCount,
    });

    const quizQuestions = shuffleAnswers(questions);

    const mappedQuestions = quizQuestions.map(({ _id, answers }) => ({
      id: _id,
      answers: answers.map((answer) => answer._id),
    }));

    const quiz = new Quiz({
      userId,
      answerCount,
      questions: mappedQuestions,
    });

    await quiz.save();

    let session = await Session.findOne({ userId });

    if (!session) {
      session = new Session({
        userId,
      });
    }

    session.quizId = quiz._id;

    await session.save();

    const questionsDtos = quizQuestions.map(
      (question) => new QuestionDto(question, null)
    );

    const quizDto = new QuizDto(quiz, questionsDtos);

    return quizDto;
  }

  async getQuizById(id) {
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      throw ApiError.badRequest("Quiz was not found.");
    }

    const answerCount = quiz.questions[0].answers.length;
    const userAnswers = quiz.answers;

    const questions = await Promise.all(
      quiz.questions.map(
        async ({ id }) => await QuestionService.getQuestionById(id, answerCount)
      )
    );

    const quizQuestions = mapAnswers(questions, quiz.questions);

    const questionsDtos = quizQuestions.map(
      (question, index) => new QuestionDto(question, userAnswers[index])
    );

    const quizDto = new QuizDto(quiz, questionsDtos);

    return quizDto;
  }

  async setAnswer({ answerId, userId }) {
    const session = await Session.findOne({ userId });
    if (!session) {
      throw ApiError.badRequest("User session doesn't exist.");
    }

    if (!session.quizId) {
      throw ApiError.badRequest("User doesn't have current quiz.");
    }

    const currentQuiz = await Quiz.findById(session.quizId);
    if (!currentQuiz) {
      throw ApiError.badRequest("Quiz is not found.");
    }

    currentQuiz.answers.push(mongoose.Types.ObjectId(answerId));
    await currentQuiz.save();

    return true;
  }

  async getQuizScore(userId) {
    const session = await Session.findOne({ userId });
    if (!session) {
      throw ApiError.badRequest("User session doesn't exist.");
    }

    if (!session.quizId) {
      throw ApiError.badRequest("User doesn't have current quiz.");
    }

    const quiz = await Quiz.findById(session.quizId);
    if (!quiz) {
      throw ApiError.badRequest("Quiz is not found.");
    }

    const answerCount = quiz.questions[0].answers.length;
    const userAnswers = quiz.answers;

    const questions = await Promise.all(
      quiz.questions.map(
        async ({ id }) => await QuestionService.getQuestionById(id, answerCount)
      )
    );

    const score = userAnswers.reduce((acc, curr, index) => {
      const question = questions[index];

      if (question.correctAnswer.toString() === curr.toString()) {
        acc++;
      }

      return acc;
    }, 0);

    quiz.score = score;
    await quiz.save();

    const quizScoreDto = new QuizScoreDto(score);

    return quizScoreDto;
  }

  async getSavedQuiz(userId) {
    const session = await Session.findOne({ userId });
    if (!session) {
      return {
        quiz: null,
        questionIndex: 0,
      };
    }

    if (!session.quizId) {
      return {
        quiz: null,
        questionIndex: 0,
      };
    }

    const currentQuiz = await Quiz.findById(session.quizId);
    if (!currentQuiz) {
      throw ApiError.badRequest("Quiz was not found.");
    }

    const answerCount = currentQuiz.questions[0].answers.length;
    const questionIndex = currentQuiz.answers.length - 1;

    const questions = await Promise.all(
      currentQuiz.questions.map(
        async ({ id }) => await QuestionService.getQuestionById(id, answerCount)
      )
    );

    const quizQuestions = mapAnswers(questions, currentQuiz.questions);

    const questionsDtos = quizQuestions.map(
      (question) => new QuestionDto(question)
    );

    const quizDto = new QuizDto(currentQuiz, questionsDtos);

    return {
      quiz: quizDto,
      questionIndex,
    };
  }
}

export default new QuizService();
