const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      user_id: {
        // When defining migrations, it is essential to remember that unlike models, column and table names are written in snake case form 'user_id' instead of 'userId'
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      session: {
        type: DataTypes.STRING,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
  },
}
