class TopicDto {
  id;
  name;
  description;

  constructor(model) {
    this.id = model._id;
    this.name = model.name;
    this.description = model.description;
    this.img = model.img;
    this.selected = model.selected;
  }
}

export default TopicDto;
