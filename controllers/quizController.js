import quizService from "../service/quizService.js";

class QuizConroller {
  async getQuiz(req, res, next) {
    try {
      const { topicId } = req.body;
      const userId = req.userData.id;

      const quizData = await quizService.getQuiz({ topicId, userId });

      return res.status(201).json(quizData);
    } catch (e) {
      next(e);
    }
  }

  async getQuizById(req, res, next) {
    try {
      const { id } = req.params;

      const quizData = await quizService.getQuizById(id);

      return res.status(200).json(quizData);
    } catch (e) {
      next(e);
    }
  }

  async setAnswer(req, res, next) {
    try {
      const { answerId } = req.body;
      const userId = req.userData.id;

      const result = await quizService.setAnswer({
        answerId,
        userId,
      });

      if (result) {
        return res.status(200).end();
      }
    } catch (e) {
      next(e);
    }
  }

  async getQuizScore(req, res, next) {
    try {
      const userId = req.userData.id;

      const result = await quizService.getQuizScore(userId);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async getSavedQuiz(req, res, next) {
    try {
      const userId = req.userData.id;

      const quizData = await quizService.getSavedQuiz(userId);

      return res.status(200).json(quizData);
    } catch (e) {
      next(e);
    }
  }
}

export default new QuizConroller();
