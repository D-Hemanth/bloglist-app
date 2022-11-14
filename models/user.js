const { Model, DataTypes } = require('sequelize');

const { sequelize } = require('../util/db');

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // checks for email format (foo@bar.com)
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true, // model names as plural snake case versions. Practically this means that, if the name of the model, as in our case is "User", then the name of the corresponding table is its plural version written with a lower case initial letter, i.e. users. If, on the other hand, the name of the model would be "two-part", e.g. Study Group, then the name of the table would be study_groups.
    timestamps: false, // we define that the table does not have to use the timestamps columns (created_at and updated_at)
    modelName: 'user', // the default "model name" would be capitalized User. However we want to have a lowercase initial so we defined 'user'
  }
);

module.exports = User;
