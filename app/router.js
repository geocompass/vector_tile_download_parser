"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/layer_names", controller.home.layer_names);
  router.get("/layer_info", controller.home.layer_info);
  router.get("/to_geojson", controller.home.to_geojson);
  router.get("/geom_and_properties", controller.home.geom_and_properties);
  router.get("/start_parse", controller.home.start_parse);
  router.get("/cover", controller.home.cover_tiles);
  router.get("/start_download", controller.home.start_download);
};
