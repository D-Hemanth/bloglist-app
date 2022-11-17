const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Sessions extends Model {}

Sessions.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    session: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'sessions',
  }
)

module.exports = Sessions
