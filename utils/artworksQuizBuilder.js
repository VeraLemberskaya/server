import axios from "axios";

import Question from "../models/Question.js";
import { generateAnswers } from "./generateAnswers.js";
import { getRandomElement } from "./getRandomElement.js";
import { getRandomInt } from "./getRandomInt.js";

const QUESTION_TITLE = {
  artwork: () => "What is the title of the artwork on the image?",
  author: () => "Who is the author of the artwork on the image?",
};

class ArtworkQuizBuilder {
  _artworksURL = "https://api.artic.edu/api/v1/artworks";
  _artworks = [];

  constructor() {
    this._getRandomArtwork = this._getRandomArtwork.bind(this);
    this._generateArtworkQuestion = this._generateArtworkQuestion.bind(this);
    this._generateAuthorQuestion = this._generateAuthorQuestion.bind(this);
  }

  async _getRandomArtwork() {
    const { data } = await axios.get(this._getArtworksURL());
    this._artworks = data.data;

    const artwork = getRandomElement(this._artworks);

    const { image_id, artist_title } = artwork;

    if (image_id && artist_title) {
      return artwork;
    }

    return this._getRandomArtwork();
  }

  _getArtworksURL() {
    const page = getRandomInt(50);
    return `https://api.artic.edu/api/v1/artworks?limit=10&page=${page}`;
  }

  _getImageURL(image_id) {
    return `https://www.artic.edu/iiif/2/${image_id}/full/843,/0/default.jpg`;
  }

  async _generateArtworkQuestion(answerCount) {
    const { title: artworkTitle, image_id } = await this._getRandomArtwork();

    if (image_id) {
      const imgURL = this._getImageURL(image_id);

      const title = QUESTION_TITLE.artwork();

      console.log("before generating answers");

      const answers = await generateAnswers({
        defaultAnswer: artworkTitle,
        getAnswerFunc: async () => {
          const { title } = await this._getRandomArtwork();
          return title;
        },
        answerCount,
      });

      console.log("after generating answers");

      return new Question({
        title,
        answers,
        img: imgURL,
      });
    }
  }

  async _generateAuthorQuestion(answerCount) {
    const { artist_title, image_id } = await this._getRandomArtwork();

    const imgURL = this._getImageURL(image_id);

    const title = QUESTION_TITLE.author();

    const answers = await generateAnswers({
      defaultAnswer: artist_title,
      getAnswerFunc: async () => {
        const { artist_title } = await this._getRandomArtwork();
        return artist_title;
      },
      answerCount,
    });

    return new Question({
      title,
      answers,
      img: imgURL,
    });
  }

  async _genQuestions() {
    const questions = [];

    while (questions.length != 100) {
      const question = await this._generateAuthorQuestion(6);

      question.correctAnswer = question.answers[0]._id;

      if (!questions.find((ques) => ques.img === question.img)) {
        console.log(question);

        questions.push(question);
      }
    }

    return questions;
  }

  async buildQuiz(questionCount, answerCount) {
    return await this._genQuestions();
  }
}

export default new ArtworkQuizBuilder();
