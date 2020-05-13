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
    let tasks = await mgModel
      .find({
        $or: [{ parsed: { $exists: false } }, { parsed: 0 }],
        zoom_level: 14,
      })
      .limit(limit);
    return tasks;
  }
  async update_parse_task(collection, zoom_level, tile_column, tile_row) {
    const { ctx } = this;
    let mgModel = ctx.model[collection];
    let query = { zoom_level, tile_column, tile_row };
    let setter = { $set: { parsed: 1 } };
    let updateResult = await mgModel.updateOne(query, setter);
    return updateResult;
  }
}
module.exports = DownloadService;
