const vtpbf = require("vt-pbf");
const VectorTile = require("@mapbox/vector-tile").VectorTile;
const Protobuf = require("pbf");
const wkx = require("wkx");

module.exports = {
  layer_names(data) {
    if (!data) {
      return null;
    }
    let tile = new VectorTile(new Protobuf(data));
    let layerNames = Object.keys(tile.layers);
    return layerNames;
  },
  layer_info(data) {
    if (!data) {
      return null;
    }
    let tile = new VectorTile(new Protobuf(data));
    let layerNames = Object.keys(tile.layers);
    let layerInfos = {};
    for (let layerName of layerNames) {
      let layer = tile.layers[layerName];
      layerInfos[layerName] = layer._keys;
    }
    return layerInfos;
  },
  pbf_to_geojson(data, z = 1, x = 0, y = 0) {
    if (!data) {
      return null;
    }
    let tile = new VectorTile(new Protobuf(data));
    let geojson = {
      type: "FeatureCollection",
      features: [],
    };
    let layerNames = Object.keys(tile.layers);
    for (let layerName of layerNames) {
      let layer = tile.layers[layerName];
      for (let index = 0; index < layer.length; index++) {
        let feature = layer.feature(index);
        if (feature) {
          let orig = feature.toGeoJSON(x, y, z);
          geojson.features.push(orig);
        }
      }
    }
    return geojson;
  },
  geom_and_properties(data, z = 1, x = 0, y = 0) {
    if (!data) {
      return null;
    }
    let tile = new VectorTile(new Protobuf(data));
    let features = {};
    let layerNames = Object.keys(tile.layers);
    for (let layerName of layerNames) {
      let layer = tile.layers[layerName];
      features[layerName] = [];
      for (let index = 0; index < layer.length; index++) {
        let feature = layer.feature(index);
        if (feature) {
          let orig = feature.toGeoJSON(x, y, z);
          let geom_pros = {};
          geom_pros = orig.properties;
          let geometry = wkx.Geometry.parseGeoJSON(orig.geometry);
          geom_pros["geom"] = geometry.toWkb().toString("hex");
          // geom_pros["geom"] = JSON.stringify(orig.geometry);
          features[layerName].push(geom_pros);
        }
      }
    }
    return features;
  },
};
