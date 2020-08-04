const map = require("lodash/map");

module.exports = async function truncate(models) {
  return await Promise.all(
    map(Object.keys(models), (key) => {
      if (["sequelize", "Sequelize"].includes(key)) return null;
      return models[key].destroy({ where: {}, force: true });
    })
  );
};