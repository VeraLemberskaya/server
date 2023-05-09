import { shuffle } from "./shuffle.js";

export const shuffleAnswers = (questions) => {
  return questions.map((question) => {
    const { answers, ...questionFields } = question;

    const shuffledAnswers = shuffle(answers);

    return {
      ...questionFields,
      answers: shuffledAnswers,
    };
  });
};
