// Example model
const bcrypt = require('bcrypt');
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
    instanceMethods: {
      generateHash(password) {
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
      },
      validPassword(password) {
        return bcrypt.compare(password, this.password);
      }
    }
  });

  return User;
};
