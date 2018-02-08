"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn("comments", "parent_id", {
      type: Sequelize.INTEGER,
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
      references: {
        model: "comments",
        key: "id"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn("comments", "parent_id");
  }
};
