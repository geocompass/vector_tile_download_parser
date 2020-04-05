const fs = require("fs");

const TOOLS = require("./app/tools");

// let [z, x, y] = [10, 851, 415];
let [z, x, y] = [13, 6814, 3321];
let path = __dirname + `/pbfs/area_${z}_${x}_${y}.mvt`;

// let [z, x, y] = [11, 1703, 830];
// let path = __dirname + `/pbfs/building_${z}_${x}_${y}.mvt`;

let data = fs.readFileSync(path);

//获取图层名称
// let layerNames = TOOLS.layer_names(data);
// console.log(layerNames);

//获取图层信息
let layersInfo = TOOLS.layer_info(data);
// console.log(JSON.stringify(layersInfo));

// 获取geojson
let geojson = TOOLS.pbf_to_geojson(data, z, x, y);
// console.log(JSON.stringify(geojson));

// 获取geojson
let geom_and_properties = TOOLS.geom_and_properties(data, z, x, y);
console.log(JSON.stringify(geom_and_properties));
