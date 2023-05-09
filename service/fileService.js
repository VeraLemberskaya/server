import fs from "fs/promises";

class FileService {
  async readFile(path) {
    try {
      const data = await fs.readFile(path, { encoding: "utf-8" });

      return JSON.parse(data);
    } catch (err) {
      throw err;
    }
  }

  async writeFile(path, data) {
    try {
      const serializedData = JSON.stringify(data);

      await fs.writeFile(path, serializedData, { encoding: "utf-8" });

      return true;
    } catch (err) {
      throw err;
    }
  }
}

export default new FileService();
