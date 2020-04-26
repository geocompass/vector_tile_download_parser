const mongoose = require("mongoose");

module.exports = (app) => {
  const { ctx, config } = app;
  const mongo_config = config.mongo_config;

  mongoose.connect(mongo_config);

  const Schema = mongoose.Schema;
  const TileSchema = new Schema({
    z: Number,
    x: Number,
    y: Number,
    data: Buffer,
  });
  let tableName = "vector_tiles";
  let model = mongoose.model(tableName, TileSchema, tableName);
  app.model[tableName] = model;
  // app.google_mgModel = model;
  // return model;

};
