const mongoose = require("mongoose");

module.exports = (app) => {
  const { ctx, config } = app;

  mongoose.connect(config.mongo_config, config.mongo_option);

  const Schema = mongoose.Schema;
  const TileSchema = new Schema({
    z: Number,
    x: Number,
    y: Number,
    data: Buffer,
  });
  let tableName = "google_image";
  let model = mongoose.model(tableName, TileSchema, tableName);
  app.model[tableName] = model;
  // app.google_mgModel = model;
  // return model;
};
