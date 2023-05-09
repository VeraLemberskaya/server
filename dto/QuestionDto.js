class Question {
  id;
  title;
  img;
  answers;
  correctAnswer;

  constructor(model) {
    this.id = model._id;
    this.title = model.title;
    this.img = model.img;
    this.correctAnswer = model.correctAnswer;
    this.answers = model.answers.map(({ _id, value }) => ({
      id: _id,
      value,
    }));
  }
}

class QuestionDto {
  question;
  userAnswer;

  constructor(model, userAnswer) {
    this.question = new Question(model);
    this.userAnswer = userAnswer;
  }
}

export default QuestionDto;
