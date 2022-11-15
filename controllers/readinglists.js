const router = require('express').Router()
const { BOOLEAN } = require('sequelize')
const { User, UserBlogs } = require('../models')
const { tokenExtractor } = require('../util/middleware')

// get route /api/readinglists to fetch all the user_blogs values added in readinglista
router.get('/', async (req, res) => {
  const readinglists = await UserBlogs.findAll({})
  res.json(readinglists)
})

// Adding a blog to the reading list is done by making an HTTP POST to the path /api/readinglists
router.post('/', async (req, res) => {
  console.log('req.body', req.body)
  const readinglistEntry = await UserBlogs.create(req.body)
  res.json(readinglistEntry)
})

// Marking as read is done by making a request to the PUT /api/readinglists/:id path
router.put('/:id', tokenExtractor, async (req, res) => {
  const readinglistEntryToEdit = await UserBlogs.findByPk(req.params.id)
  // get the userId of the user trying to edit the readinglist from tokenExtractor
  const editorUserId = req.decodedToken.id
  // console.log('editorUserId: ', editorUserId)

  // verify that the user is allowed to edit by comparing the editorUserId & readinglistEntryToEdit.userId
  if (!(editorUserId === readinglistEntryToEdit.userId)) {
    res.status(401).json({
      error:
        'Invalid readinglist id, you can only mark blogs in your reading list as read',
    })
  }

  // update the readinglist entry in db to be marked as read
  readinglistEntryToEdit.read = req.body.read
  // console.log('read value', req.body.read)
  await readinglistEntryToEdit.save()
  res.json(readinglistEntryToEdit)
})

module.exports = router
