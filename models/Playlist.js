const { Schema } = require('mongoose')

const playlistSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  isPublic: { type: Boolean, required: true, default: false },
  coverImg: { type: String, default: '' },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Song' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = playlistSchema