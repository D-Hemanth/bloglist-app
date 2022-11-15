const router = require('express').Router();
const { UserBlogs } = require('../models');

// Adding a blog to the reading list is done by making an HTTP POST to the path /api/readinglists
router.post('/', async (req, res) => {
  console.log('req.body', req.body);
  const readinglistEntry = await UserBlogs.create(req.body);
  res.json(readinglistEntry);
});

module.exports = router;
