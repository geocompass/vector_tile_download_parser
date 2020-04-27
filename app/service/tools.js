const axios = require("axios");
const camelcase = require("camelcase");
const mongoose = require("mongoose");

const Service = require("egg").Service;

class DownloadService extends Service {
  async downloadImage(url, z, x, y) {
    let data = null;
    await axios
      .get(url, {
        responseType: "arraybuffer",
      })
      .then((response) => {
        data = Buffer.from(response.data, "binary"); //.toString("base64");
      })
      .catch((err) => {
        console.log(
          "request image got error,z:",
          z,
          "x:",
          x,
          ",y:",
          y,
          "err:",
          err
        );
      });
    return data;
  }
  async downloadAndUpdateMG(collection, z, x, y) {
    const { ctx, app, config } = this;
    let mgModel = app.model[collection]
    let url = config.tile_urls[collection];
    url = url.replace('{x', '${x')
    url = url.replace('{y', '${y')
    url = url.replace('{z', '${z')
    url = eval('`' + url + '`');
    let image_data = await this.downloadImage(url, z, x, y);
    if (!image_data) {
      // console.log("image download failed:", z, x, y);
      return;
    }
    // task.data = image_data;
    let query = { x: x, y: y, z: z };
    let setter = { $set: { data: image_data } };
    await mgModel.updateOne(query, setter);
    console.log("DONE", z, x, y)
  }
  async wmts(collection, z, x, y) {
    const { ctx, app, config } = this;
    let mgModel = app.model[collection]
    let query = { x: x, y: y, z: z };
    let tilesData = await mgModel.findOne(query);
    return tilesData['data']
  }
}
module.exports = DownloadService;
