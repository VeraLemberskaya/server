import topicService from "../service/topicService.js";

class TopicController {
  async getTopics(req, res, next) {
    try {
      const topics = await topicService.getTopics();

      return res.status(200).json(topics);
    } catch (e) {
      next(e);
    }
  }
}

export default new TopicController();
