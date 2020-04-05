"use strict";

const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      hi: "egg",
      layer_names:
        "http://127.0.0.1:7001/layer_names?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
      layer_info:
        "http://127.0.0.1:7001/layer_info?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
      to_geojson:
        "http://127.0.0.1:7001/to_geojson?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
      geom_and_properties:
        "http://127.0.0.1:7001/geom_and_properties?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
    };
  }
  async layer_names() {
    const { ctx } = this;
    let url = ctx.query.url;
    if (!url) {
      ctx.body = `mapbox vector tile url params not found. example:
      http://127.0.0.1:7001/layer_names?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;
      return;
    }
    let layer_names = await ctx.service.home.layer_names(url);
    ctx.body = layer_names;
  }
  async layer_info() {
    const { ctx } = this;
    let url = ctx.query.url;
    if (!url) {
      ctx.body = `mapbox vector tile url params not found. example:
      http://127.0.0.1:7001/layer_info?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;
      return;
    }
    let layerInfo = await ctx.service.home.layer_info(url);
    ctx.body = layerInfo;
  }
  async to_geojson() {
    const { ctx } = this;
    let url = ctx.query.url;
    let { x, y, z } = ctx.query;
    if (!url) {
      ctx.body = `mapbox vector tile url params not found. example:
        http://127.0.0.1:7001/to_geojson?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;
      return;
    }
    if (!x || !y || !z) {
      ctx.body = "&z={z}&x={x}&={y}";
    }
    let geojson = await ctx.service.home.pbf_to_geojson(url, z, x, y);
    ctx.body = geojson;
  }
  async geom_and_properties() {
    const { ctx } = this;
    let url = ctx.query.url;
    let { x, y, z } = ctx.query;
    if (!url) {
      ctx.body = `mapbox vector tile url params not found. example:
        http://127.0.0.1:7001/geom_and_properties?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;
      return;
    }
    if (!x || !y || !z) {
      ctx.body = "&z={z}&x={x}&={y}";
    }
    let geom_properties = await ctx.service.home.geom_and_properties(
      url,
      z,
      x,
      y
    );
    ctx.body = geom_properties;
  }
  async start_parse() {
    const { ctx } = this;
    let url = `http://7rp.geo-compass.com/api/v1/codeMap/false/321102005007/10/851/415.mvt?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODYwODQyNDgsInVzZXJpZCI6IjE4NjI0NiIsInVzZXJuYW1lIjoiMzIxMTAyIiwiY29kZSI6IjMyMTEwMiIsImNvZGVfbmFtZSI6IuS6rOWPo-WMuiIsImtleSI6IkVGRTIxNEMyN0Y0N0JCMjg5NDAwOTYzMTE2Qjg0QzIzIiwiaWF0IjoxNTg1OTk3ODQ4fQ.zcq0viChPM9N2mykxgjIoOAqi646EUbgylV8TqI0DmE`;
    let [z, x, y] = [10, 851, 415];
    let geom_properties = await ctx.service.home.geom_and_properties(
      url,
      z,
      x,
      y
    );
    ctx.body = await ctx.service.mvtParser.mg2pg(geom_properties);
  }
  async start_download() {
    const { ctx } = this;
    // let url = ctx.query.url;
    let collection = ctx.query.collection;
    // if (!url) {
    //   ctx.body = `mapbox vector tile url params not found. example:
    //     http://127.0.0.1:7001/geom_and_properties?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;
    //   return;
    // }
    if (!collection) {
      ctx.body = "&collection=google_images not found.";
      return;
    }
    let mgModel = await ctx.service.task.mgModel(collection);
    while (true) {
      let tasks = await ctx.service.task.get_task(mgModel, 1000);
      if (!tasks) {
        ctx.body = "not found download tasks.";
        break;
      }
      // let url = `http://ditu.google.cn/maps/vt/lyrs=s&x=${x}&y=${y}&z=${z}`;
      for (let task of tasks) {
        let { x, y, z } = task;
        let url = `https://t1.tianditu.gov.cn/DataServer?T=vec_w&x=${x}&y=${y}&l=${z}&tk=4830425f5d789b48b967b1062deb8c71`;
        let image_data = await ctx.service.download.downloadImage(url, z, x, y);
        if (!image_data) {
          console.log("image download failed:", z, x, y);
          continue;
        }
        // task.data = image_data;
        let query = { x: task.x, y: task.y, z: task.z };
        let setter = { $set: { data: image_data } };
        await mgModel.update(query, setter);
      }
    }

    ctx.body = tasks;
  }
}

module.exports = HomeController;
