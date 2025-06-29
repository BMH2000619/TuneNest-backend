const router = require('express').Router()
const controller = require('../controllers/SongController')
const middleware = require('../middleware')

// Public Routes
router.get('/', controller.getAllSongs)
router.get('/:id', controller.getSongById)

// Protected Routes
router.post('/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.createSong
)

router.put('/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.updateSong
)

router.delete('/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.deleteSong
)

module.exports = router