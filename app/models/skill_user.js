module.exports = (sequelize, DataTypes) => {
  const SkillUser = sequelize.define("SkillUser", {
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
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: "skill_users",
    underscored: true
  });
  return SkillUser;
};
