import Topic from "../models/Topic.js";
import ApiError from "../exceptions/ApiError.js";
import TopicDto from "../dto/TopicDto.js";

class TopicService {
  async getTopics() {
    const topics = await Topic.find();

    if (!topics) {
      throw ApiError.internalServerError("Can't get quiz topics.");
    }

    const topicDtos = topics.map((topic) => new TopicDto(topic));

    return topicDtos;
  }
}

export default new TopicService();
