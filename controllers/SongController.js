const { Song } = require('../models')

// Get All Songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('addedBy', 'username img')
    res.status(200).json(songs)
  } catch (err) {
    console.error('getAllSongs error:', err)
    res
      .status(500)
      .json({ message: 'Failed to fetch songs', error: err.message })
  }
}

// Get A Single Song By ID
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate(
      'addedBy',
      'username img'
    )
    if (!song) {
      return res.status(404).json({ message: 'Song not found' })
    }

    res.status(200).json(song)
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to fetch song', error: err.message })
  }
}

// Create A New Song
const createSong = async (req, res) => {
  req.user = res.locals.payload
  try {
    console.log('REQ.BODY:', req.body)
    console.log('REQ.USER:', req.user)
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' })
    }
    const { title, artist, url, duration } = req.body

    const newSong = await Song.create({
      title,
      artist,
      url,
      duration,
      addedBy: req.user._id
    })

    res.status(201).json(newSong)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to create song', error: err.message })
  }
}

// Update A Song
const updateSong = async (req, res) => {
  req.user = res.locals.payload
  try {
    const song = await Song.findById(req.params.id)
    if (!song) {
      return res.status(404).json({ message: 'Song not found' })
    }

    if (!song.addedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const { title, artist, url, duration } = req.body

    song.title = title ?? song.title
    song.artist = artist ?? song.artist
    song.url = url ?? song.url
    song.duration = duration ?? song.duration

    await song.save()
    res.status(200).json(song)
  } catch (err) {
    res
      .status(400)
      .json({ message: 'Failed to update song', error: err.message })
  }
}

// Delete A Song
const deleteSong = async (req, res) => {
  req.user = res.locals.payload
  try {
    const song = await Song.findById(req.params.id)
    if (!song) {
      return res.status(404).json({ message: 'Song not found' })
    }

    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized: No user found' })
    }

    if (!song.addedBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    await song.deleteOne() // use deleteOne instead of remove for newer Mongoose
    res.status(200).json({ message: 'Song deleted successfully' })
  } catch (err) {
    console.error('Delete song error:', err)
    res
      .status(500)
      .json({ message: 'Failed to delete song', error: err.message })
  }
}

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  deleteSong
}
