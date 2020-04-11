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
}
module.exports = DownloadService;
