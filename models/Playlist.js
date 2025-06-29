const { Schema } = require('mongoose')

const playlistSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  isPublic: { type: Boolean, required: true, default: false },
  coverImg: { type: String, default: '' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true })

module.exports = playlistSchema