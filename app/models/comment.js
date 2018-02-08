module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "Comment",
    {
      article_id: { type: Sequelize.INTEGER, allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      user_id: { type: Sequelize.INTEGER, allowNull: false },
      parent_id: { type: Sequelize.INTEGER },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    },
    {
      underscored: true,
      tableName: "comments",
      classMethods: {
        associate: models => {
          Comment.belongsTo(models.Article, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          });
          Comment.hasMany(models.Comment, {
            as: "SubComments",
            foreignKey: "parent_id"
          });
          Comment.belongsTo(models.Comment, {
            as: "Parent"
          });
          Comment.belongsTo(models.User, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
          });
        }
      }
    }
  );
  return Comment;
};
