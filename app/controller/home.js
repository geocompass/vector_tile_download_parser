"use strict";
const axios = require("axios");
const moment = require("moment");
const TOOLS = require("../tools");
const Controller = require("egg").Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = {
      hi: "egg",
      download: {
        step_1: "获取兴趣区域的区划代码，如110108",

        "1.cover":
          "http://127.0.0.1:7001/cover?area_code=110108&zoom=14&collection=tdt_image",
        "2.start_download":
          "http://127.0.0.1:7001/start_download?collection=tdt_image",
      },
      mvt: {
        start_parse_batch:
          "http://127.0.0.1:7001/parse_mvt_batch?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
        start_parse_one:
          "http://127.0.0.1:7001/parse_mvt_one?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
        layer_names:
          "http://127.0.0.1:7001/layer_names?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
        layer_info:
          "http://127.0.0.1:7001/layer_info?url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
        to_geojson:
          "http://127.0.0.1:7001/to_geojson?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
        geom_and_properties:
          "http://127.0.0.1:7001/geom_and_properties?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA",
      },
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
  async cover_tiles() {
    const { ctx, config } = this;
    let { collection, zoom, area_code, tile_type } = ctx.query;
    if (!collection || !zoom || !area_code) {
      ctx.body = "collection, zoom, area_code params not found.";
      return;
    }
    let cover_url = config.python_cover_host + "/cover";
    let cover_res = await axios.get(cover_url, {
      params: {
        area_code,
        collection,
        zoom,
        tile_type,
      },
    });
    ctx.body = cover_res.data;

    //'http://127.0.0.1:5001/cover?area_code=110108&zoom=14&collection=tdt_image&tile_type=image/vector'
  }
  //开始批量下载瓦片
  async start_download() {
    const { ctx, app } = this;
    // let url = ctx.query.url;
    let collection = ctx.query.collection;
    // if (!url) {
    //   ctx.body = `mapbox vector tile url params not found. example:
    //     http://127.0.0.1:7001/geom_and_properties?z=16&x=53557&y=28604&url=https://b.tiles.mapbox.com/v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-streets-v7/16/53557/28604.vector.pbf?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA`;
    //   return;
    // }
    async function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    if (!collection) {
      ctx.body = "&collection=google_image not found.";
      return;
    }
    let batch_count = 0;
    while (true) {
      let tasks = await ctx.service.task.get_download_task(collection, 1000);
      if (!tasks || tasks.length === 0) {
        console.log(
          "not found download tasks, or done the download task!================================"
        );
        ctx.body = "not found download tasks, or done the download task!";
        break;
      }
      batch_count++;
      console.log(
        `get ${batch_count} batch ${tasks.length} tasks to download==================================`,
        moment().format()
      );
      for (let index in tasks) {
        let { x, y, z } = tasks[index];
        ctx.service.tools.downloadAndUpdateMG(collection, z, x, y);
        if (index % 100 === 0) {
          console.log("100 hundard downloaded!", moment().format());
          await TOOLS.sleep(1000);
        }
      }
    }
    console.log("ALL image downloaded DONEEEEEEEE!!!!!!!!!!!!===========");
    ctx.body = "ALL image downloaded DONEEEEEEEE!!!!!!!";
  }
  //解析一个矢量切片
  async parse_mvt_one() {
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
  //批量解析矢量数据
  async start_parse_mvt() {
    const { ctx, app } = this;
    let collection = ctx.query.collection;

    if (!collection) {
      ctx.body = "&collection=vector_tile not found.";
      return;
    }
    let batch_count = 0;
    while (true) {
      let tasks = await ctx.service.task.get_parse_task(collection, 1);
      if (!tasks || tasks.length === 0) {
        console.log(
          "not found parsed tasks, or done the parsed task!================================"
        );
        ctx.body = "not found parsed tasks, or done the parsed task!";
        break;
      }
      batch_count++;
      console.log(
        `get ${batch_count} batch ${tasks.length} tasks to parsed==================================`,
        moment().format()
      );
      for (let index in tasks) {
        let { x, y, z } = tasks[index];
        let paser_result = await ctx.service.home.tiledata_parse_insert(
          collection,
          z,
          x,
          y
        );
        if (paser_result) {
          await ctx.service.task.update_parse_task(collection, z, x, y);
        }
      }
      // break;
    }
    console.log("ALL image parsed DONEEEEEEEE!!!!!!!!!!!!===========");
  }
  async wmts() {
    const { ctx } = this;
    let { z, x, y, collection } = ctx.query;
    let tileData = await ctx.service.tools.wmts(collection, z, x, y);
    ctx.set("Content-Type", "image/jpeg");
    ctx.body = tileData;
  }
}

module.exports = HomeController;
