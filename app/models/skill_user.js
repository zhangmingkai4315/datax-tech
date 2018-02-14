/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块导出声明
 * 模块提供skill_users数据库表的模型定义
 * @public
 */

module.exports = (sequelize, DataTypes) => {
  const SkillUser = sequelize.define(
    "SkillUser",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      skill_id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER
      }
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "skill_users",
      underscored: true
    }
  );
  return SkillUser;
};
