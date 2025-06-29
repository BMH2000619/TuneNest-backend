const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const multer = require('multer')
const path = require('path')

// REQUIRE ROUTES
const AuthRouter = require('./routes/AuthRouter')
const playlistRoutes = require('./routes/PlaylistRouter')
const songRoutes = require('./routes/SongRouter')
const commentRoutes = require('./routes/CommentRouter')

const PORT = process.env.PORT || 3001

const db = require('./db')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// APP USE MODELS
app.use('/auth', AuthRouter)
app.use('/playlists', playlistRoutes)
app.use('/songs', songRoutes)
app.use('/comment', commentRoutes)


app.use('/', (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})