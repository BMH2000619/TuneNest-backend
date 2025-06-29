const Comment = require('../models/Comment')

// Get All Comment For A Specific Playlist
const getCommentsByPlaylist = async (req, res) => {
  try {
    const comments = await Comment.find({ playlistId: req.params.playlistId}).populate('userId', 'username img').sort({ createdAt: -1})

    res.status(200).json(comments)
  } catch (err) {
    res.status(500).json({ message: 'Failed to load comment', error: err.message })
  }
}

// Create A New Comment On A Playlist
const createComment = async (req, res) => {
  try {
    const { comment } = req.body

    const newComment = await Comment.create({
      playlistId: req.params.playlistId,
      userId: req.user._id,
      comment,
    })

    const populatedComment = await newComment.populate('userId', 'username img')

    res.status(201).json(populatedComment)
  } catch (err) {
    res.status(400).json({ message: 'Failed to create comment', error: err.message })
  }
}

// Update a Comment
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if(!comment) {
      return res.status(403).json({ message: 'Comment not found'})
    }
    
    if (!comment.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to edit this comment' })
    }

    comment.comment = req.body.comment ?? comment.comment
    await comment.save()

    const populatedComment = await comment.populate('userId', 'username img')
    res.status(200).json(populatedComment)
  } catch (err) {
    res.status(400).json({ message: 'failed to update comment' })
  }
}

// Delete A Comment
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if(!comment) {
      return res.status(404).json({ message: 'Comment not found'})
    }

    if(!comment.userId.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this comment' })
    }

    await comment.remove()
    res.status(200).json({ message: 'Comment deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete comment', error: err.message })
  }
}

module.exports = {
  getCommentsByPlaylist,
  createComment,
  updateComment,
  deleteComment,
}