import axios from "axios";
import ApiError from "../exceptions/ApiError.js";

import Question from "../models/Question.js";
import { generateAnswers } from "./generateAnswers.js";
import { generateQuestions } from "./generateQuestions.js";
import { getRandomElement } from "./getRandomElement.js";

const QUESTION_TITLE = {
  character: () => "What is the name of the character on the image?",
  spell: (spell) => `What effect doest spell "${spell}" have?`,
};

class harryPotterQuizService {
  _charactersURL = "https://hp-api.herokuapp.com/api/characters";
  _spellsURL = "https://hp-api.herokuapp.com/api/spells";
  _characters = [];
  _spells = [];

  constructor() {
    this._getRandomCharacter = this._getRandomCharacter.bind(this);
    this._getRandomSpell = this._getRandomSpell.bind(this);
    this._generateCharacterQuestion =
      this._generateCharacterQuestion.bind(this);
    this._generateSpellQuestion = this._generateSpellQuestion.bind(this);
  }

  _getRandomCharacter() {
    const character = getRandomElement(this._characters);

    if (character.image) {
      return character;
    }

    return this._getRandomCharacter();
  }

  _getRandomSpell() {
    return getRandomElement(this._spells);
  }

  _generateCharacterQuestion(answerCount) {
    const { name, image } = this._getRandomCharacter();

    const title = QUESTION_TITLE.character();

    const answers = generateAnswers({
      defaultAnswer: name,
      getAnswerFunc: () => this._getRandomCharacter().name,
      answerCount,
    });

    return new Question({
      title,
      answers,
      img: image,
    });
  }

  _generateSpellQuestion(answerCount) {
    const { name, description } = this._getRandomSpell();

    const title = QUESTION_TITLE.spell(name);

    const answers = generateAnswers({
      defaultAnswer: description,
      getAnswerFunc: () => this._getRandomSpell().description,
      answerCount,
    });

    return new Question({
      title,
      answers,
    });
  }

  _genQuestions() {
    const questions = [];

    while (questions.length !== 75) {
      const question = this._generateSpellQuestion(6);

      question.correctAnswer = question.answers[0]._id;

      if (!questions.find((ques) => ques.title === question.title)) {
        questions.push(question);
      }
    }

    return questions;
  }

  async buildQuiz(questionCount, answerCount) {
    const { data: characters } = await axios.get(this._charactersURL);
    const { data: spells } = await axios.get(this._spellsURL);

    const charactersWithImage = characters.filter((ch) => ch.image);

    console.log(charactersWithImage.length);
    console.log(spells.length);

    if (!characters || !spells) {
      throw ApiError.internalServerError(
        "Failed to create quiz. Data not found."
      );
    }

    this._characters = characters;
    this._spells = spells;

    // const questions = generateQuestions({
    //   questionCount,
    //   getQuestionFunc: () =>
    //     getRandomElement([
    //       this._generateCharacterQuestion,
    //       this._generateSpellQuestion,
    //     ])(answerCount),
    // });

    // console.log(questions);

    const questions = this._genQuestions();

    return questions;
  }
}

export default new harryPotterQuizService();
