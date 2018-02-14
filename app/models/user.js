/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块依赖
 * bcrypt模块用于提供用户加密操作的函数接口
 * @private
 */

const bcrypt = require("bcrypt");

/**
 * 模块导出声明
 * 模块提供users数据库表的模型定义
 * @public
 */

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          len: [5, 20]
        }
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING
      },
      role: {
        type: DataTypes.ENUM,
        values: ["user", "admin", "disabled"],
        defaultValue: "user"
      },
      image_url: DataTypes.STRING,
      thunbnail_url: DataTypes.STRING,
      globe_url: DataTypes.STRING,

      github_url: DataTypes.STRING,
      github_id: DataTypes.INTEGER,
      github_token: DataTypes.STRING,

      weibo_url: DataTypes.STRING,
      facebook_url: DataTypes.STRING,
      twitter_url: DataTypes.STRING,

      group_name: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      job_name: {
        type: DataTypes.STRING,
        defaultValue: ""
      },
      introduce: DataTypes.STRING,
      last_login: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      underscored: true,
      tableName: "users",
      instanceMethods: {
        generateHash(password) {
          return bcrypt.hash(password, bcrypt.genSaltSync(8));
        },
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        }
      },
      classMethods: {
        associate: models => {
          // 建立1:N的映射关系
          User.hasMany(models.Article);
          // users表与comments表建立1:N的映射关系，当用户删除的时候
          // 同时删除所有相关评论,当用户id发生变换时，子表中同样发生变化
          User.hasMany(models.Comment, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          });
          // users表与skills表通过skill_users表建立N:M的映射关系
          User.belongsToMany(models.Skill, {
            through: {
              model: models.SkillUser,
              unique: false
            },
            foreignKey: "user_id",
            constraints: false
          });
          // users表与articles表通过user_likes表建立N:M的映射关系
          User.belongsToMany(models.Article, {
            through: {
              model: models.UserLike,
              unique: false
            },
            as: "Likes",
            foreignKey: "user_id"
          });
          // users表与articles表通过user_collections表建立N:M的映射关系
          User.belongsToMany(models.Article, {
            through: {
              model: models.UserCollection,
              unique: false
            },
            as: "Collections",
            foreignKey: "user_id"
          });
        }
      }
    }
  );
  return User;
};
