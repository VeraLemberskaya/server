export const generateAnswers = async ({
  defaultAnswer,
  answerCount,
  getAnswerFunc,
}) => {
  let answers = [{ value: defaultAnswer }];

  while (answers.length !== answerCount) {
    const answer = await getAnswerFunc();

    if (!answers.includes(answer)) {
      answers.push({ value: answer });
    }
  }
  return answers;
};
