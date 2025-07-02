const { Playlist } = require('../models')

// Get All Public Playlists
const getAllPublicPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ isPublic: true })
      .populate('createdBy', 'username img')
      .populate('songs')

    res.status(200).json(playlists)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch playlists', error: err.message })
  }
}

// Get a Single Playlist by ID
const getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('songs')
      .populate('createdBy')
    if (!playlist)
      return res.status(404).json({ message: 'Playlist not found' })
    res.json(playlist)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch playlist', error: err.message })
  }
}

// Create A New Playlist
const createPlaylist = async (req, res) => {
  try {
    const { title, description, isPublic, songs } = req.body

    const newPlaylist = await Playlist.create({
      title,
      description,
      isPublic,
      songs,
      createdBy: req.user._id
    })

    res.status(201).json(newPlaylist)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error creating playlist', error: err.message })
  }
}

// Update A Playlist
const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }

    //Only The Owner Can Update
    if (!playlist.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const { title, description, isPublic, songs } = req.body

    playlist.title = title ?? playlist.title
    playlist.description = description ?? playlist.description
    playlist.isPublic = isPublic ?? playlist.isPublic
    playlist.songs = songs ?? playlist.songs

    await playlist.save()

    res.status(200).json(playlist)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Error updating playlist', error: err.message })
  }
}

// Delete A Playlist
const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)

    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' })
    }

    // Only The Owner Can Delete
    if (!playlist.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await playlist.remove()

    res.status(200).json({ message: 'Playlist deleted successfully' })
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Error deleting playlist', error: err.message })
  }
}

const likePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
    if (!playlist)
      return res.status(404).json({ message: 'Playlist not found' })
    if (playlist.createdBy.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: 'Owners cannot like their own playlist' })
    }
    if (!playlist.likes.includes(req.user._id)) {
      playlist.likes.push(req.user._id)
      await playlist.save()
    }
    // Populate before sending
    const populated = await Playlist.findById(playlist._id)
      .populate('songs')
      .populate('createdBy')
    res.status(200).json(populated)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to like playlist', error: err.message })
  }
}

const unlikePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
    if (!playlist)
      return res.status(404).json({ message: 'Playlist not found' })
    playlist.likes = playlist.likes.filter(
      (userId) => userId.toString() !== req.user._id.toString()
    )
    await playlist.save()
    // Populate before sending
    const populated = await Playlist.findById(playlist._id)
      .populate('songs')
      .populate('createdBy')
    res.status(200).json(populated)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to unlike playlist', error: err.message })
  }
}

module.exports = {
  getAllPublicPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  likePlaylist,
  unlikePlaylist
}
