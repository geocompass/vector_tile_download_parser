const Service = require("egg").Service;

class DownloadService extends Service {
  async get_task(mgModel, limit) {
    const { ctx, app, config } = this;
    let tasks = await mgModel.find({ data: null }).limit(limit);
    return tasks;
  }
}
module.exports = DownloadService;
