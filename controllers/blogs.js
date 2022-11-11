const router = require('express').Router();

const { Blog, User } = require('../models');

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
  // console.log('post req.body', req.body);
  const user = await User.findOne();
  const blog = await Blog.create({ ...req.body, userId: user.id });
  res.json(blog);
});

// the repetitive code of findByPk can be refactored into our own middleware and implement it in the route handlers
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

// DELETE route api/blogs/:id delete a blog using destroy method after finding the blog using findByPk method
router.delete('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    await req.blog.destroy();
  } else {
    res.status(400).end();
  }
});

// PUT route api/blogs/:id update a blog using update method after finding the blog using findByPk method
router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(400).end();
  }
});

module.exports = router;
