import collections
from rasterio.crs import CRS
from rasterio.warp import transform
from rasterio.features import rasterize
from rasterio.transform import from_bounds
import mercantile
from supermercado import burntiles

from flask import Flask, request, Response, jsonify
from flask_sqlalchemy import SQLAlchemy as _SQLAlchemy, BaseQuery
import pymongo
import json

# connect postgresql
SQLALCHEMY_DATABASE_URI = 'postgres+psycopg2://postgres:postgres@localhost/tdt2018'
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
db = _SQLAlchemy(app)

# connect mongodb
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
myMongo = myclient["vector_tile"]


def queryBySQL(sql):
    return db.session.execute(sql)


@app.route('/')
def hello_world():
    return 'Hello flask!'


@app.route('/cover', methods=['GET'])
def cover():
    result = {
        "code": 1,
        "data": None,
        "msg": "create batch task success！"
    }
    area_code = request.args.get('area_code')
    zoom = request.args.get('zoom')
    collection = request.args.get('collection')

    if not area_code or not zoom or not collection:
        result['code'] = 0
        result['msg'] = "no area_code,zoom,collection params"
        return jsonify(result)
    zoom = int(zoom)
    quhuaTable = 'data_xian'
    if len(area_code) == 6:
        quhuaTable = "data_xian"
    elif len(area_code) == 4:
        quhuaTable = "quhua_shi"
    elif len(area_code) == 2:
        quhuaTable = "quhua_sheng"
    else:
        result['code'] = 0
        result['msg'] = "area_code not support"
        return jsonify(result)

    geojson = get_geojson_by_areacode(quhuaTable, area_code)
    if not geojson:
        result['code'] = 0
        result['msg'] = "geojson request failed."
        return jsonify(result)
    covers = get_cover_by_geojson(geojson, zoom)
    insert_covers(covers, collection)
    result['data'] = covers
    return jsonify(result)


def get_geojson_by_areacode(quhuaTable, areacode):
    sql = """
            SELECT 
            '{{"type": "Feature", "geometry": ' 
            || ST_AsGeoJSON(st_simplify(geom,0.001)) 
            || '}}' AS features 
            FROM {quhuaTable} WHERE code like '{areacode}%'
        """
    queryData = queryBySQL(sql.format(
        areacode=areacode, quhuaTable=quhuaTable))
    if not queryData:
        return False
    area_json = queryData.fetchone()
    if not area_json or len(area_json) == 0:
        return False

    return json.loads(area_json[0])


def get_cover_by_geojson(geojson, zoom):
    feature_map = collections.defaultdict(list)

    feature_map = geojson_parse_feature(
        zoom, 4326, feature_map, geojson)

    covers = feature_map.keys()
    XYZs = []
    for cover in covers:
        xyz = {
            "x": int(cover.x),
            "y": int(cover.y),
            "z": int(cover.z),
            "data": None
        }
        XYZs.append(xyz)

    return XYZs


def geojson_reproject(feature, srid_in, srid_out):
    """Reproject GeoJSON Polygon feature coords
       Inspired by: https://gist.github.com/dnomadb/5cbc116aacc352c7126e779c29ab7abe
    """

    if feature["geometry"]["type"] == "Polygon":
        xys = (zip(*ring) for ring in feature["geometry"]["coordinates"])
        xys = (list(zip(*transform(CRS.from_epsg(srid_in),
                                   CRS.from_epsg(srid_out), *xy))) for xy in xys)

        yield {"coordinates": list(xys), "type": "Polygon"}


def geojson_parse_feature(zoom, srid, feature_map, feature):
    def geojson_parse_polygon(zoom, srid, feature_map, polygon):

        if srid != 4326:
            polygon = [xy for xy in geojson_reproject(
                {"type": "feature", "geometry": polygon}, srid, 4326)][0]

        # GeoJSON coordinates could be N dimensionals
        for i, ring in enumerate(polygon["coordinates"]):
            polygon["coordinates"][i] = [[x, y]
                                         for point in ring for x, y in zip([point[0]], [point[1]])]

        if polygon["coordinates"]:
            for tile in burntiles.burn([{"type": "feature", "geometry": polygon}], zoom=zoom):
                feature_map[mercantile.Tile(
                    *tile)].append({"type": "feature", "geometry": polygon})

        return feature_map

    def geojson_parse_geometry(zoom, srid, feature_map, geometry):

        if geometry["type"] == "Polygon":
            feature_map = geojson_parse_polygon(
                zoom, srid, feature_map, geometry)

        elif geometry["type"] == "MultiPolygon":
            for polygon in geometry["coordinates"]:
                feature_map = geojson_parse_polygon(
                    zoom, srid, feature_map, {"type": "Polygon", "coordinates": polygon})

        return feature_map

    if feature["geometry"]["type"] == "GeometryCollection":
        for geometry in feature["geometry"]["geometries"]:
            feature_map = geojson_parse_geometry(
                zoom, srid, feature_map, geometry)
    else:
        feature_map = geojson_parse_geometry(
            zoom, srid, feature_map, feature["geometry"])

    return feature_map


def insert_covers(covers, collection):
    myCol = myMongo[collection]
    for cover in covers:
        myCol.replace_one(
            filter={"x": cover["x"], "y": cover["y"], "z": cover["z"]},
            replacement=cover,
            upsert=True
        )


if __name__ == '__main__':
    app.run(port=5000)


# How to run this server backend?
# >: python xyz_proxy.py &
