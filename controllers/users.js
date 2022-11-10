const router = require('express').Router();

const { User } = require('../models');

// GET route for listing all users
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// POST route for adding a new user
router.post('/', async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

// PUT api/users/:username - changing a username, keep in mind that the parameter is not id but username
router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: { username: req.params.username },
  });
  if (user) {
    user.username = req.body.username;
    await user.save();
    res.json(user);
  } else {
    res.status(404).end();
  }
});

module.exports = router;
