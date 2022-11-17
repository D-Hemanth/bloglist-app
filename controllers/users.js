const router = require('express').Router()

const { User, Blog, UserBlogs } = require('../models')

// GET route for listing all users
// we return all fields of the user associated with all the blog fields but excluding the userId using attributes, exclude & includes options from sequelize
router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
    },
  })
  res.json(users)
})

// POST route for adding a new user
router.post('/', async (req, res) => {
  const user = await User.create({
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  res.json(user)
})

// get /api/users/:id route for getting readinglist of users
router.get('/:id', async (req, res) => {
  const where = {}

  if (req.query.read) {
    where.read = req.query.read
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'disabled'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: {
          exclude: ['userId', 'createdAt', 'updatedAt'],
        },
        through: {
          attributes: [], // to not include the 'user_blogs' fields
        },
        include: {
          model: UserBlogs,
          as: 'readinglists', // the alias name here should be the same which we created in controllers/index file i.e. 'readinglists'
          attributes: ['read', 'id'],
          where,
        },
      },
    ],
  })
  res.json(user)
})

// PUT api/users/:username - changing a username, keep in mind that the parameter is not id but username
router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username },
  })
  if (user) {
    user.username = req.body.username
    user.updatedAt = new Date()
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
