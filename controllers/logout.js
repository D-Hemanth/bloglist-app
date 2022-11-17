const router = require('express').Router()
const { tokenExtractor, sessionValidator } = require('../util/middleware')
const Sessions = require('../models/sessions')

// delete /api/logout route to remove the user session token from session table
router.delete(
  '/',
  tokenExtractor,
  sessionValidator,
  async (request, response) => {
    await Sessions.destroy({
      where: {
        userId: request.decodedToken.id,
      },
    })
  }
)

module.exports = router
