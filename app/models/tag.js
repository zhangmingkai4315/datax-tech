const Sequelize = require("sequelize");

module.exports = sequelize => {
  const Tag = sequelize.define(
    "Tag",
    { name: { type: Sequelize.STRING, unique: true, allowNull: false } },
    {
      underscored: true,
      timestamps: false,
      freezeTableName: true,
      tableName: "tags",
      classMethods: {
        associate: models => {
          // example on how to add relations Article.hasMany(models.Comments);
          Tag.belongsToMany(models.Article, {
            through: {
              model: models.ArticleTag,
              unique: false
            },
            foreignKey: "tag_id",
            constraints: false
          });
        }
      }
    }
  );
  return Tag;
};
