/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块导出声明
 * 模块提供user_likes数据库表的模型定义
 * @public
 */

module.exports = (sequelize, DataTypes) => {
  const UserLike = sequelize.define(
    "UserLike",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      article_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "user_likes",
      underscored: true
    }
  );
  return UserLike;
};
