class QuizDto {
  id;
  score;
  questions;

  constructor(model, questions) {
    this.id = model._id;
    this.score = model.score;
    this.questions = questions;
  }
}

export default QuizDto;
