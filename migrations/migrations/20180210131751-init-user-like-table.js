module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("user_likes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      article_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "articles",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      }
    });
  },

  down: (queryInterface) => {
    queryInterface.dropTable("user_likes");
  }
};
