const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Sessions = require('../models/sessions')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username,
    },
  })

  // validate that a correct password is given (we are using dummy secret password here)
  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  // use jwt to generate a signed token
  const token = jwt.sign(userForToken, SECRET)

  // create & store token inside session table after token has been created for verified user
  const createSession = await Sessions.create({
    userId: user.id,
    session: token,
  })
  // console.log('create session', createSession)

  // return the token generated in the response
  response.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = router
