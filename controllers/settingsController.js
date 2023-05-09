import SettingService from "../service/settingService";

class SettingsController {
  async getSettings(req, res, next) {
    try {
      const settings = await SettingService.getSettings();

      return settings;
    } catch (e) {
      next(e);
    }
  }
}
