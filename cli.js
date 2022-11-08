require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    // await sequelize.authenticate();
    // console.log('Connection has been established succesfully.');

    // execute raw / already prepared SQL queries, you can use the sequelize.query method.
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    });
    // console.log('blogs from psql', blogs);

    blogs.map((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();
