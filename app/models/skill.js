/*!
 * datax-tech 网站源码
 * Copyright(c) 2017-2018 zhangmingkai4315(zhangmingkai.1989@gmail.com)
 * MIT Licensed
 */

/**
 * 模块导出声明
 * 模块提供skills数据库表的模型定义
 * @public
 */

module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    { name: { type: DataTypes.STRING, unique: true, allowNull: false } },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      tableName: "skills",
      classMethods: {
        associate: models => {
          // example on how to add relations Article.hasMany(models.Comments);
          Skill.belongsToMany(models.User, {
            through: {
              model: models.SkillUser,
              unique: false
            },
            foreignKey: "skill_id",
            constraints: false
          });
        }
      }
    }
  );
  return Skill;
};
