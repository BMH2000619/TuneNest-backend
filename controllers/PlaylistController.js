const Playlist = require('../models/Playlist')
const Song = require('../models/Song')

// Get All Public Playlists
const getAllPublicPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true }).populate('createdBy', 'username img').populate('songs')

    res.status(200).json(playlists)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch playlists', error: err.message })
  }
}

// Get a Single Playlist by ID
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('createdBy', 'username img').populate('songs')

    if(!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }

    res.status(200).json(playlist)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch playlist', error: err.message })
  }
}

