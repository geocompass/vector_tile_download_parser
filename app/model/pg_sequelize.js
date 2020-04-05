const Sequelize = require("sequelize");
module.exports = (app) => {
  const { ctx, config } = app;
  const pg_config = config.sequelize;
  let sequelize = new Sequelize(
    pg_config.database,
    pg_config.username,
    pg_config.password,
    {
      host: pg_config.host,
      port: pg_config.port,
      dialect: pg_config.dialect,
      pool: pg_config.pool,
      define: pg_config.define,
      logging: pg_config.logging,
      timezone: pg_config.timezone,
      // dialectOptions:pg_config.dialectOptions,
    }
  );
  app.pg_sequelize = sequelize;
};
