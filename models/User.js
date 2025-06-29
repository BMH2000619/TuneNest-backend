const { Schema } = require('mongoose')

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordDigest: { type: String, required: true },
  img: { type: String, default: '' },
  likedPlaylists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }],
  createdPlaylists: [{ type: Schema.Types.ObjectId, ref: 'Playlist' }]
}, {
  timestamps: true
}
)

module.exports = userSchema