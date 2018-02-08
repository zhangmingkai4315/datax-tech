"use strict";

module.exports = {
  up: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.createTable("articles", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        cover_img: Sequelize.STRING,
        read_counter: Sequelize.INTEGER,
        like_counter: Sequelize.INTEGER,
        collected_counter: Sequelize.INTEGER,
        cover_img_thumbnail: Sequelize.STRING,
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id"
          },
          allowNull: false,
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      }),
      queryInterface.createTable("comments", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        article_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "articles",
            key: "id"
          },
          allowNull: false,
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        user_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "users",
            key: "id"
          },
          allowNull: false,
          onUpdate: "CASCADE",
          onDelete: "CASCADE"
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW
        }
      })
    ]),
  down: (queryInterface, Sequelize) =>
    Promise.all([
      queryInterface.dropTable("articles"),
      queryInterface.dropTable("comments")
    ])
};
