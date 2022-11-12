const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

// get route for /api/authors that returns the number of blogs for each author and the total number of likes using sequelize findAll method of Blog model
router.get('/', async (req, res) => {
  // We have also restricted the values of which fields we want using attributes options from sequelize with group by function & order by function
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
      [sequelize.fn('SUM', sequelize.col('likes')), 'likes'],
    ],
    group: 'author',
    order: sequelize.literal('likes DESC'),
  })
  // In the case of a collection of objects, the method JSON.stringify is better, (null, 2) also Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
  // console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs)
})

module.exports = router
