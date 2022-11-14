const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('user_blogs', {
      id: {
        type: DataTypes.INTEGER,
        primarykey: true,
        autoIncrement: true,
      },
      user_id: {
        // When defining migrations, it is essential to remember that unlike models, column and table names are written in snake case form 'user_id' instead of 'userId'
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
      },
      read: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('user_blogs')
  },
}
