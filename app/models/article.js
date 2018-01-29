// Example model

const Sequelize = require('sequelize');
const User = require('./user')
module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    content: Sequelize.TEXT,
    head_img: DataTypes.STRING
  }, {
    classMethods: {
      associate: (models) => {
        // example on how to add relations Article.hasMany(models.Comments);
        Article.belongsTo(models.User, {foreignKey: 'fk_user'}) // add fk_user to article
      }
    }
  });
  return Article;
};
