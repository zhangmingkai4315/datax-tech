"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: [5, 20]
        }
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.ENUM,
        values: ["user", "admin", "disabled"],
        defaultValue: "user"
      },
      image_url: Sequelize.STRING,
      thunbnail_url: Sequelize.STRING,
      globe_url: Sequelize.STRING,

      github_url: Sequelize.STRING,
      github_id: Sequelize.INTEGER,
      github_token: Sequelize.STRING,

      weibo_url: Sequelize.STRING,
      facebook_url: Sequelize.STRING,
      twitter_url: Sequelize.STRING,

      group_name: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      job_name: {
        type: Sequelize.STRING,
        defaultValue: ""
      },
      introduce: Sequelize.STRING,
      last_login: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.dropTable("users");
  }
};
