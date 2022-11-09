require('dotenv').config();
const { Sequelize, DataTypes, Model } = require('sequelize');
const express = require('express');
const app = express();

// It parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());

const sequelize = new Sequelize(process.env.DATABASE_URL);

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
  },
  {
    sequelize,
    underscored: true, // model names as plural snake case versions. Practically this means that, if the name of the model, as in our case is "Blog", then the name of the corresponding table is its plural version written with a lower case initial letter, i.e. blogs. If, on the other hand, the name of the model would be "two-part", e.g. Study Group, then the name of the table would be study_groups.
    timestamps: false, // we define that the table does not have to use the timestamps columns (created_at and updated_at)
    modelName: 'blog', // the default "model name" would be capitalized Blog. However we want to have a lowercase initial so we defined 'blog'
  }
);

// Sequelize is actually able to generate a schema automatically from the model definition by using the models method sync so that the db in psql & model schema of db both matches
// when the application starts, the command CREATE TABLE IF NOT EXISTS "blogs"... is executed inside psql db which creates the table blogs if it does not already exist.
Blog.sync();

// get route to get all saved blogs in psql table blogs using sequelize findAll method of Blog model
app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll();
  // In the case of a collection of objects, the method JSON.stringify is better, (null, 2) also Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

// post route to create new blogs using sequelize create method of Blog model
// it is also possible to save to a database using the build method first to create a Model-object from the desired data, and then calling the save method on it as it lets us edit blog before saving also: const blog = Blog.build(req.body); blog.likes = 3; await blog.save()
app.post('/api/blogs', async (req, res) => {
  try {
    // console.log('post req.body', req.body);
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// DELETE route api/blogs/:id delete a blog using destroy method after finding the blog using findByPk method
app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await blog.destroy();
  } else {
    res.status(400).end();
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
