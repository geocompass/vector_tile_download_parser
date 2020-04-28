const axios = require("axios");
const camelcase = require("camelcase");
const mongoose = require("mongoose");

const Service = require("egg").Service;

class ParserService extends Service {
  async mg2pg(geom_properties) {
    const { ctx, app, config } = this;
    let result = true;
    let layerNames = Object.keys(geom_properties);
    for (let layerName of layerNames) {
      let layerCase = camelcase(layerName, { pascalCase: true });
      if (!app.model.hasOwnProperty(layerCase)) {
        continue;
      }
      let dataModel = app.model[layerCase];
      let bulkResult = await dataModel
        .bulkCreate(geom_properties[layerName])
        .then((res) => {
          result = true;
        })
        .catch((err) => {
          result = false;
        });
    }
    return result;
  }
}
module.exports = ParserService;
