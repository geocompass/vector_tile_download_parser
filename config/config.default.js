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
      // vector_tile: `http://yjvt.geo-compass.com/geocmap/api/v1/tileset/11001000001/4/{z}/{x}/{y}.pbf`,
      vector_tile: `http://172.16.108.201:7002/api/v1/tileset/11001000001/4/{z}/{x}/{y}.pbf`,
    },
    // python_cover_host: "http://172.16.111.2:5004",
    python_cover_host: "http://127.0.0.1:5004",
    // mongo_config: "mongodb://localhost:27017/vector_tile",
    mongo_config: "mongodb://172.16.108.201:27018/vector_tile",
    sequelize: {
      dialect: "postgres",
      // host: "localhost",
      host: "172.16.100.143",
      port: 5432,
      database: "china_census7",
      // database: "tile_download_parse",
      username: "postgres",
      password: "postgres",
      timezone: "+08:00",
      // dialectOptions: {
      //   dateStrings: true,
      //   typeCast: true
      // },
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
      logging: function (sql) { },
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
