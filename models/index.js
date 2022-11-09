const Blog = require('./blog');

// Sequelize is actually able to generate a schema automatically from the model definition by using the models method sync so that the db in psql & model schema of db both matches
// when the application starts, the command CREATE TABLE IF NOT EXISTS "blogs"... is executed inside psql db which creates the table blogs if it does not already exist.
Blog.sync();

module.exports = {
  Blog,
};
