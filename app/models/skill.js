const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const Skill = sequelize.define(
    "Skill",
    { name: { type: Sequelize.STRING, unique: true, allowNull: false } },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      tableName: "skills",
      classMethods: {
        associate: (models) => {
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
