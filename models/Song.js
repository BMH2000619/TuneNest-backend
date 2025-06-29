const { Schema } = require('mongoose')

const songSchema = new Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    url: { type: String, required: true },
    duration: { type: String, default: '' },
    addedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
)

module.exports = songSchema