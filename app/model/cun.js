module.exports = (app) => {
  const { STRING, INTEGER, DATE, GEOMETRY } = app.Sequelize;

  const cun = app.model.define("cun", {
    id: {
      type: INTEGER,
      primaryKey: true,
    },
    code: STRING,
    codeName: STRING,
    state: INTEGER,
    xiang_code: STRING,
    geom: STRING,
  });
  return cun;
};
