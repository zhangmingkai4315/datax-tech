const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  const Article = sequelize.define("Article", {
    title: {
      type: Sequelize.STRING,
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    content: Sequelize.TEXT,
    cover_img: Sequelize.STRING,
    read_counter: Sequelize.INTEGER,
    like_counter: Sequelize.INTEGER,
    collected_counter: Sequelize.INTEGER,
    cover_img_thumbnail: Sequelize.STRING
  }, {
    underscored: true,
    tableName: "articles",
    classMethods: {
      associate: (models) => {
        // example on how to add relations Article.hasMany(models.Comments);
        Article.hasMany(models.Comment, {
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
        });
        Article.belongsTo(models.User); // add fk_user to article

        Article.belongsToMany(models.User, {
          through: {
            model: models.UserLike,
            unique: false
          },
          as: "Likers",
          foreignKey: "article_id",
          constraints: false
        });
        Article.belongsToMany(models.User, {
          through: {
            model: models.UserCollection,
            unique: false
          },
          as: "Collectors",
          foreignKey: "article_id",
          constraints: false
        });
      }
    }
  });
  return Article;
};
