"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      "skills",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: { type: Sequelize.STRING, unique: true, allowNull: false }
      },
      {
        underscored: true,
        paranoid: true,
        classMethods: {
          associate: models => {}
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable("skills");
  }
};
