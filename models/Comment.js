const { Schema } = require('mongoose')

const commentSchema = new Schema(
  {
    playlistId: {},
    userId: {},
    comment: {},
  }, { timestamps: true }
)

module.exports = commentSchema