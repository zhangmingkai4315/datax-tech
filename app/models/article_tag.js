module.exports = (sequelize, DataTypes) => {
  const ArticleTag = sequelize.define(
    "ArticleTag",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      tag_id: { type: DataTypes.INTEGER },
      article_id: { type: DataTypes.INTEGER }
    },
    {
      timestamps: false,
      freezeTableName: true,
      tableName: "article_tags",
      underscored: true
    }
  );
  return ArticleTag;
};
