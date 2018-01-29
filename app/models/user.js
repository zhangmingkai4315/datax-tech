// Example model
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
      type: Sequelize.STRING,
      allowNull: false
    },
    image_url: Sequelize.STRING,
    last_login: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    is_admin: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
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
    },
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Article);
      }
    }
  });

  return User;
};
