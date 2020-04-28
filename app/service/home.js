const fs = require("fs");
const axios = require("axios");
const TOOLS = require("../tools");

const Service = require("egg").Service;

class HomeService extends Service {
  async buffer_from_url(url) {
    let mvt_buffer = null;
    await axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        mvt_buffer = Buffer.from(response.data, "binary");
      });
    if (!mvt_buffer) {
      return false;
    }
    return mvt_buffer;
  }

  async layer_names(url) {
    let mvt_buffer = await this.buffer_from_url(url);
    let layers_names = TOOLS.layer_names(mvt_buffer);
    return layers_names;
  }
  async layer_info(url) {
    let mvt_buffer = await this.buffer_from_url(url);
    let layers_info = TOOLS.layer_info(mvt_buffer);
    return layers_info;
  }
  async pbf_to_geojson(url, z, x, y) {
    let mvt_buffer = await this.buffer_from_url(url);
    let pbf_to_geojson = TOOLS.pbf_to_geojson(mvt_buffer, z, x, y);
    return pbf_to_geojson;
  }
  async geom_and_properties(url, z, x, y) {
    let mvt_buffer = await this.buffer_from_url(url);
    let geom_and_properties = TOOLS.geom_and_properties(mvt_buffer, z, x, y);
    return geom_and_properties;
  }
  async tiledata_parse_insert(collection, z, x, y) {
    const { app, ctx, config } = this;
    let mgModel = app.model[collection];
    let query = { x: x, y: y, z: z };
    let tilesData = await mgModel.findOne(query);
    let mvt_buffer = tilesData.data;
    let geom_and_properties = TOOLS.geom_and_properties(mvt_buffer, z, x, y);
    let parseResult = await ctx.service.mvtParser.mg2pg(geom_and_properties);
    return parseResult;
  }
}
module.exports = HomeService;
