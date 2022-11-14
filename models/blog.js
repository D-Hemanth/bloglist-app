const { DataTypes, Model } = require('sequelize');

const { sequelize } = require('../util/db');

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    underscored: true, // model names as plural snake case versions. Practically this means that, if the name of the model, as in our case is "Blog", then the name of the corresponding table is its plural version written with a lower case initial letter, i.e. blogs. If, on the other hand, the name of the model would be "two-part", e.g. Study Group, then the name of the table would be study_groups.
    timestamps: false, // we define that the table does not have to use the timestamps columns (created_at and updated_at)
    modelName: 'blog', // the default "model name" would be capitalized Blog. However we want to have a lowercase initial so we defined 'blog'
  }
);

module.exports = Blog;
