const axios = require("axios");
const camelcase = require("camelcase");
const mongoose = require("mongoose");

const Service = require("egg").Service;

class ParserService extends Service {
  async mg2pg(geom_properties) {
    const { ctx, app, config } = this;
    let result = ["ok"];
    let layerNames = Object.keys(geom_properties);
    for (let layerName of layerNames) {
      let layerCase = camelcase(layerName, { pascalCase: true });
      if (!app.model.hasOwnProperty(layerCase)) {
        result.push("Data model not found:" + layerName);
        continue;
      }
      let bulkResult = await app.model[layerCase]
        .bulkCreate(geom_properties[layerName])
        .catch((err) => {
          result.push("feature bulk create failed:" + layerName + err);
        });
    }
    return result;
  }
}
module.exports = ParserService;
