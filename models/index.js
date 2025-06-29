const mongoose = require('mongoose')
const userSchema = require('./User')
const playlistSchema = require('./Playlist')
const songSchema = require('./Song')
const commentSchema = require('./Comment')

const User = mongoose.model('User', userSchema)
const Playlist = mongoose.model('Playlist', playlistSchema)
const Song = mongoose.model('Song', songSchema)
const Comment = mongoose.model('Comment', commentSchema)

module.exports = {
  User, Playlist, Song, Comment
}