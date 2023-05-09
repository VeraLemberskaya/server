export const generateQuestions = ({ questionCount, getQuestionFunc }) =>
  new Array(questionCount).fill().map(() => getQuestionFunc());
