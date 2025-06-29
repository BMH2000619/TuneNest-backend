const router = require('express').Router()
const controller = require('../controllers/CommentController')
const middleware = require('../middleware')

// Public
router.get('/playlist/:playlistId', controller.getCommentsByPlaylist)

// Protected
router.post(
  '/playlist/:playlistId',
  middleware.stripToken,
  middleware.verifyToken,
  controller.createComment
)

router.delete(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.deleteComment
)

router.put(
  '/:id',
  middleware.stripToken,
  middleware.verifyToken,
  controller.updateComment
)

module.exports = router