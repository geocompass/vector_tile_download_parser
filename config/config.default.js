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
    mongo_config: "mongodb://localhost:27017/vector_tile",
    sequelize: {
      dialect: "postgres",
      host: "localhost",
      port: 5432,
      database: "tile_download_parse",
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
      logging: function (sql) {},
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
