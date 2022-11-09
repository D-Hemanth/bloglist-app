const router = require('express').Router();

const { Blog } = require('../models');

// get route to get all saved blogs in psql table blogs using sequelize findAll method of Blog model
router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  // In the case of a collection of objects, the method JSON.stringify is better, (null, 2) also Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

// post route to create new blogs using sequelize create method of Blog model
// it is also possible to save to a database using the build method first to create a Model-object from the desired data, and then calling the save method on it as it lets us edit blog before saving also: const blog = Blog.build(req.body); blog.likes = 3; await blog.save()
router.post('/', async (req, res) => {
  try {
    // console.log('post req.body', req.body);
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

// DELETE route api/blogs/:id delete a blog using destroy method after finding the blog using findByPk method
router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await blog.destroy();
  } else {
    res.status(400).end();
  }
});

// PUT route api/blogs/:id update a blog using update method after finding the blog using findByPk method
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (blog) {
    await blog.update({ likes: req.body.likes });
    res.json(blog);
  } else {
    res.status(400).end();
  }
});

module.exports = router;
