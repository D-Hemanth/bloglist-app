const router = require('express').Router();
const jwt = require('jsonwebtoken');

const { Blog, User } = require('../models');
const { SECRET } = require('../util/config');
const { Op } = require('sequelize');
const { sequelize } = require('../util/db');

// get route to get all saved blogs in psql table blogs using sequelize findAll method of Blog model
router.get('/', async (req, res) => {
  let where = {};

  // to make search query case insensitive use the following pattern matching in Op.iLike method
  let searchKeyword = `%${req.query.search}%`;
  if (req.query.search) {
    where = {
      [Op.or]: {
        title: {
          [Op.iLike]: searchKeyword,
        },
        author: {
          [Op.iLike]: searchKeyword,
        },
      },
    };
  }

  // We have also restricted the values of which fields we want. For each blog, we return all fields including the name of the user associated with the blog but excluding the userId using attributes, exclude & includes options from sequelize
  const blogs = await Blog.findAll({
    order: sequelize.literal('likes DESC'),
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
  });
  // In the case of a collection of objects, the method JSON.stringify is better, (null, 2) also Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

// The helper function tokenExtractor isolates the token from the authorization header, get token for authorization in every request made to the server
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  // console.log('authorization', authorization);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      // Authorization header will have the value: Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW then substring(7) returns only the token
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: 'token invalid' });
    }
  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  next();
};

// post route to create new blogs using sequelize create method of Blog model
// it is also possible to save to a database using the build method first to create a Model-object from the desired data, and then calling the save method on it as it lets us edit blog before saving also: const blog = Blog.build(req.body); blog.likes = 3; await blog.save()
router.post('/', tokenExtractor, async (req, res) => {
  // console.log('post req.body', req.body);
  const user = await User.findByPk(req.decodedToken.id);

  const currentYear = new Date().getFullYear();
  if (Number(req.body.year) > currentYear) {
    return res
      .status(401)
      .json({
        error:
          'year value is greater than current year & it should be between 1991 to current year',
      });
  } else if (Number(req.body.year) < 1991) {
    return res.status(401).json({
      error:
        'year value is less than 1991 & it should be between 1991 to current year',
    });
  }

  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  res.json(blog);
});

// the repetitive code of findByPk can be refactored into our own middleware and implement it in the route handlers
const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  next();
};

// DELETE route api/blogs/:id delete a blog using destroy method after finding the blog using findByPk method
// route handlers now receive three parameters second being the middleware blogFinder we defined earlier, which retrieves the blog from the database and places it in the blog property of the req object
router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
  if (req.blog) {
    const user = await User.findByPk(req.decodedToken.id);
    if (user.id === req.blog.userId) {
      await req.blog.destroy();
    } else {
      return res.status(401).json({
        error:
          "You are not authorized to delete this blog entry since you haven't created it",
      });
    }
  } else {
    res.status(400).json({ error: 'Invalid blog id parameter' });
  }
});

// PUT route api/blogs/:id update a blog using update method after finding the blog using findByPk method
router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes;
    req.blog.updatedAt = new Date();
    await req.blog.save();
    res.json(req.blog);
  } else {
    res.status(400).json({ error: 'Invalid blog id parameter' });
  }
});

module.exports = router;
