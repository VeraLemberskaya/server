import ApiError from "../exceptions/ApiError.js";
import FileService from "./fileService.js";

class SettingService {
  filename = "settings.json";

  async getSettings() {
    const settings = await FileService.readFile(this.filename);
    if (!settings) {
      throw ApiError.internalServerError("Can't get settings.");
    }

    return settings;
  }

  async saveSettings(data) {
    return FileService.writeFile(this.filename, data);
  }
}

export default new SettingService();
