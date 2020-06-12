/* eslint valid-jsdoc: "off" */

"use strict";

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1585990125666_7866";

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    tile_urls: {
      google_image: `http://ditu.google.cn/maps/vt/lyrs=s&x={x}&y={y}&z={z}`,
      tdt_image: `https://t1.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=4830425f5d789b48b967b1062deb8c71`,
      vector_tile: `http://mvt_host/api/v1/tileset/{z}/{x}/{y}.pbf`,
    },
    python_cover_host: "http://127.0.0.1:5004",
    mongo_config: "mongodb://127.0.0.1:27017/vector_tile",
    mongo_option: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    sequelize: {
      dialect: "postgres",
      host: "127.0.0.1",
      port: 5432,
      database: "quhua_data",
      username: "postgres",
      password: "***",
      timezone: "+08:00",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      define: {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
      },
      logging: function (sql) {},
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
