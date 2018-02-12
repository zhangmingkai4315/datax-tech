"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable("tags", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING
        }
      }),
      queryInterface.createTable("article_tags", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        tag_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "tags",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        article_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "articles",
            key: "id"
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        }
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.dropTable("article_tags"),
      queryInterface.dropTable("tags")
    ]);
  }
};
