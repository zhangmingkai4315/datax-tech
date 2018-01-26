// Example model
const Sequelize = require('sequelize');

module.exports = (sequelize) => {

  const User = sequelize.define('User', {
    username: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    password: Sequelize.STRING,
    image_url: Sequelize.STRING,
    last_login: Sequelize.DATE,
    is_admin: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    classMethods: {
      associate: (models) => {
        // example on how to add relations Article.hasMany(models.Comments);
      }
    }
  });

  return User;
};
