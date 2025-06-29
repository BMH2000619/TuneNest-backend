const Song = require('../models/Song')

// Get All Songs
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().populate('addedBy', 'username img')
    res.status(200).json(songs)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch songs', error:err.message })
  }
}

// Get A Single Song By ID
const getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('addedBy', 'username img')
    if (!song) {
      return res.status(404).json({ message: 'Song not found' })
    }

    res.status(200).json(song)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch song', error: err.message })
  }
}

// Create A New Song
const createSong = async (req, res) => {
  try {
    const { title, artist, url, duration } = req.body

    const newSong = await Song.create({
      title,
      artist,
      url,
      duration,
      addedBy: req.user._id,
    })

    res.status(291).json(newSong)
  } catch (err) {
    res.status(400).json({ message: 'Failed to create song', error: err.message })
  }
}

