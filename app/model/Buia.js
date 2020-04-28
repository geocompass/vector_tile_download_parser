module.exports = (app) => {
  const { STRING, INTEGER, DATE, GEOMETRY } = app.Sequelize;

  const BUIA = app.model.define("BUIA", {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    CLASID: STRING,
    geom: STRING,
  });
  return BUIA;
};
