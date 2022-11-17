const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const Sessions = require('../models/sessions')

// next - next function yields control to the next middleware or function or route
const errorHandler = (error, request, response, next) => {
  // console.error(error.message);
  // console.error('ERROR NAME:', error.name);
  // console.error('ERROR FULL', error);

  // error handler checks if the error is a CastError exception
  if (error.name === 'SequelizeDatabaseError') {
    // console.log(error);
    return response
      .status(400)
      .send({ error: 'malformatted id in the address url' })
  }
  // error handler checks if the error is a ValidationError exception from the note schema
  else if (error.name === 'SyntaxError') {
    return response.status(400).json({
      error:
        'check the syntax & data type of required fields in your request submission data',
    })
  } else if (error.name === 'SequelizeValidationError') {
    const errorTypeName = error.errors[0].validatorName
    const errorMessage = error.errors[0].message

    if (errorTypeName === 'isEmail') {
      return response.status(400).send({
        error: [errorMessage],
      })
    }
  }

  next(error)
}

// The helper function tokenExtractor isolates the token from the authorization header, get token for authorization in every request made to the server
const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  // console.log('authorization', authorization);
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      // Authorization header will have the value: Bearer eyJhbGciOiJIUzI1NiIsInR5c2VybmFtZSI6Im1sdXVra2FpIiwiaW then substring(7) returns only the token
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

// helper function sessionValidator checks if the session token is available in the session table for a given userId
const sessionValidator = async (req, res, next) => {
  // find the userId in the session table along with the session token for that userId
  const userSession = await Sessions.findByPk(req.decodedToken.id)

  if (!userSession) {
    return res
      .status(401)
      .json({ error: 'session has expired!, please login again.' })
  }

  next()
}

module.exports = { errorHandler, tokenExtractor, sessionValidator }
