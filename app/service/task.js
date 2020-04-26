const Service = require("egg").Service;

class DownloadService extends Service {
  async get_task(collection, limit) {
    const { ctx, app, config } = this;
    let mgModel = ctx.model[collection];
    let tasks = await mgModel.find({ data: null }).limit(limit);
    return tasks;
  }
}
module.exports = DownloadService;
