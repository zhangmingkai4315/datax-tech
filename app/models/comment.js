const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    article_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    content: Sequelize.TEXT,
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    underscored: true,
    tableName: "comments",
    classMethods: {
      associate: (models) => {
        // example on how to add relations Article.hasMany(models.Comments);
        Comment.belongsTo(models.Article);
        Comment.belongsTo(models.User); // add fk_user to article
      }
    }
  });
  return Comment;
};
