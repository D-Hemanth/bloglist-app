const Blog = require('./blog');
const User = require('./user');

// we define that there is a one-to-many relationship connection between the users and blogs entries, meaning that one User has many Blogs, while each Blog belongs to a single User
User.hasMany(Blog);
Blog.belongsTo(User);

// // Sequelize is actually able to generate a schema automatically from the model definition by using the models method sync so that the db in psql & model schema of db both matches
// // when the application starts, the command CREATE TABLE IF NOT EXISTS "blogs"... is executed inside psql db which creates the table blogs if it does not already exist.
// Blog.sync({ alter: true });
// User.sync({ alter: true });

module.exports = {
  Blog,
  User,
};
