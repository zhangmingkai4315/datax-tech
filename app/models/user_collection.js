module.exports = (sequelize, DataTypes) => {
  const UserCollection = sequelize.define(
    "UserCollection",
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
      tableName: "user_collections",
      underscored: true
    }
  );
  return UserCollection;
};
