const axios = require("axios");
const camelcase = require("camelcase");
const mongoose = require("mongoose");

const Service = require("egg").Service;

class DownloadService extends Service {
  async get_task(mgModel, limit) {
    const { ctx, app, config } = this;
    let tasks = await mgModel.find({ data: null }).limit(limit);
    return tasks;
  }
  async mgModel(tableName) {
    if (!tableName) {
      return null;
    }
    const { ctx, app, config } = this;
    if (mongoose && mongoose.model && mongoose.models[tableName]) {
      return mongoose.models[tableName];
    }

    mongoose.connect(config.mongo_config);

    const Schema = mongoose.Schema;
    const TileSchema = new Schema({
      z: Number,
      x: Number,
      y: Number,
      data: Buffer,
    });
    let model = mongoose.model(tableName, TileSchema, tableName);
    app.model[tableName] = model;
    return model;
  }
}
module.exports = DownloadService;
