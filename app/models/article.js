// Example model

const Sequelize = require("sequelize");
const User = require("./user");
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "Article",
    {
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      content: Sequelize.TEXT,
      head_img: Sequelize.STRING
    },
    {
      underscored: true,
      tableName: "articles",
      classMethods: {
        associate: models => {
          // example on how to add relations Article.hasMany(models.Comments);
          Article.belongsTo(models.User); // add fk_user to article
        }
      }
    }
  );
  return Article;
};
