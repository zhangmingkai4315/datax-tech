module.exports = (sequelize, DataTypes) => {
  const UserLike = sequelize.define("UserLike", {
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
  }, {
    timestamps: false,
    freezeTableName: true,
    tableName: "user_likes",
    underscored: true
  });
  return UserLike;
};
