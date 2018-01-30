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
    role: {
      type: Sequelize.ENUM,
      values: [
        'user', 'admin', 'disabled'
      ],
      defaultValue: 'user'
    },
    image_url: Sequelize.STRING,
    thunbnail_url: Sequelize.STRING,
    group_name: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    job_name: {
      type: Sequelize.STRING,
      defaultValue: ''
    },
    introduce: Sequelize.STRING,
    last_login: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    underscored: true,
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
        User.belongsToMany(models.Skill, {
          through: {
            model: models.SkillUser,
            unique: false
          },
          foreignKey: 'user_id',
          constraints: false
        });
      }
    }
  });

  return User;
};
