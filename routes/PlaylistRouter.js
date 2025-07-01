const router = require('express').Router()
const controller = require('../controllers/PlaylistController')
const middleware = require('../middleware')

// Public Routes
router.get('/', controller.getAllPublicPlaylists)
router.get('/:id', controller.getPlaylistById)

// Protected Routes
router.post(
  '/',
  middleware.stripToken,
  middleware.verifyToken,
  controller.createPlaylist
)

router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.updatePlaylist
)

router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.deletePlaylist
)

module.exports = router
