module.exports = (app) => {
  const { STRING, INTEGER, DATE, GEOMETRY } = app.Sequelize;

  const BUIA = app.model.define("BUIA", {
    gid: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CLASID: STRING,
    geom: STRING,
  });
  return BUIA;
};
