const express = require('express')
const app = express()
// express-async-errors library allows us to eliminate the try-catch blocks completely while sending error to errorHandler middleware without using next in routes
require('express-async-errors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const { errorHandler } = require('./util/middleware')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const readingListRouter = require('./controllers/readinglists')
const logoutRouter = require('./controllers/logout')

// It parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/logout', logoutRouter)

// this has to be the last loaded middleware.
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
