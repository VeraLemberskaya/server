export const mapAnswers = (questions, refQuestions) => {
  return questions.map(({ _id, answers, ...rest }) => {
    const { answers: answersOrder } = refQuestions.find((question) =>
      question.id.equals(_id)
    );

    const mappedAnswers = answersOrder.reduce(
      (prev, id) => [...prev, answers.find((answer) => answer._id.equals(id))],
      []
    );

    return {
      _id,
      answers: mappedAnswers,
      ...rest,
    };
  });
};
