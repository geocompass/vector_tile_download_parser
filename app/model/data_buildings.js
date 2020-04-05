module.exports = (app) => {
  const { STRING, INTEGER, DATE, GEOMETRY } = app.Sequelize;

  const data_buildings = app.model.define("data_buildings", {
    uuid: {
      type: STRING,
      primaryKey: true,
    },
    source: INTEGER,
    sjzt: INTEGER,
    hy_state: INTEGER,
    sh_state: INTEGER,
    floor_count: INTEGER,
    xz_population: INTEGER,
    xz_door_count: INTEGER,
    risk: INTEGER,
    cooperate: INTEGER,
    build_state: INTEGER,
    build_name: STRING,
    address_detail: STRING,
    sortid: STRING,
    geom: STRING,
  });
  return data_buildings;
};
