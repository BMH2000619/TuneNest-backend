const { Schema } = require('mongoose')

const commentSchema = new Schema(
  {
    playlistId: {
      type: Schema.Types.ObjectId,
      ref: 'Playlist',
      required: true
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = commentSchema
