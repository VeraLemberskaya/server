import axios from "axios";

import ApiError from "../exceptions/ApiError.js";
import Question from "../models/Question.js";
import { generateAnswers } from "./generateAnswers.js";
import { generateQuestions } from "./generateQuestions.js";
import { getRandomElement } from "./getRandomElement.js";

const QUESTION_TITLE = {
  capital: (countryName) => `What is the capital of country ${countryName}?`,
  flag: () => "What country does this flag belong to?",
};

class CountryQuizService {
  _countriesURL = "https://restcountries.com/v2/all";
  _countries = [];

  constructor() {
    this._getCountryWithCapital = this._getCountryWithCapital.bind(this);
    this._getRandomCountry = this._getRandomCountry.bind(this);
    this._generateCapitalQuestion = this._generateCapitalQuestion.bind(this);
    this._generateFlagQuestion = this._generateFlagQuestion.bind(this);
  }

  _getRandomCountry() {
    return getRandomElement(this._countries);
  }

  _getCountryWithCapital() {
    const country = getRandomElement(this._countries);
    if (country.capital) {
      return country;
    }
    return this._getCountryWithCapital();
  }

  _generateCapitalQuestion(answerCount) {
    const { name, capital } = this._getCountryWithCapital();

    const title = QUESTION_TITLE.capital(name);

    const answers = generateAnswers({
      defaultAnswer: capital,
      getAnswerFunc: () => this._getCountryWithCapital().capital,
      answerCount,
    });

    return new Question({
      title,
      answers,
    });
  }

  _generateFlagQuestion(answerCount) {
    const { name, flag } = this._getRandomCountry();

    const title = QUESTION_TITLE.flag();

    const answers = generateAnswers({
      defaultAnswer: name,
      getAnswerFunc: () => this._getRandomCountry().name,
      answerCount,
    });

    return new Question({
      title,
      answers,
      img: flag,
    });
  }

  _genQuestions() {
    const questions = [];

    while (questions.length !== 100) {
      const question = this._generateFlagQuestion(6);

      question.correctAnswer = question.answers[0]._id;

      if (!questions.find((ques) => ques.img === question.img)) {
        questions.push(question);
      }
    }

    return questions;
  }

  async buildQuiz(questionCount, answerCount) {
    const { data } = await axios.get(this._countriesURL);

    if (!data) {
      throw ApiError.internalServerError(
        "Failed to create country quiz. Countries not found."
      );
    }

    this._countries = data;

    // const questions = generateQuestions({
    //   questionCount: 200,
    //   getQuestionFunc: () =>
    //     getRandomElement([
    //       this._generateCapitalQuestion,
    //       this._generateFlagQuestion,
    //     ])(6),
    // });

    const questions = this._genQuestions();

    return questions;
  }
}

export default new CountryQuizService();
