const Service = require("egg").Service;

class DownloadService extends Service {
  async get_download_task(collection, limit) {
    const { ctx, app, config } = this;
    let mgModel = ctx.model[collection];
    let tasks = await mgModel.find({ data: null }).limit(limit);
    return tasks;
  }
  async get_parse_task(collection, limit) {
    const { ctx, app, config } = this;
    let mgModel = ctx.model[collection];
    let tasks = await mgModel.find({ parsed: 0 }).limit(limit);
    return tasks;
  }
  async update_parse_task(collection, z, x, y) {
    const { ctx } = this;
    let mgModel = ctx.model[collection];
    let query = { x: x, y: y, z: z };
    let setter = { $set: { parsed: 1 } };
    let updateResult = await mgModel.updateOne(query, setter);
    return updateResult;
  }
}
module.exports = DownloadService;
