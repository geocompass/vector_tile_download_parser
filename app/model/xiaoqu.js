module.exports = (app) => {
  const { STRING, INTEGER, DATE, GEOMETRY } = app.Sequelize;

  const xiaoqu = app.model.define("xiaoqu", {
    id: {
      type: INTEGER,
      primaryKey: true,
    },
    code: STRING,
    codeName: STRING,
    state: INTEGER,
    xz_population: INTEGER,
    geom: STRING,
  });
  return xiaoqu;
};
