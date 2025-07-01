const { User } = require('../models')
const middleware = require('../middleware')
const upload = require('../middleware/multer-config')

const Register = async (req, res) => {
  try {
    const { username, password, email, img } = req.body

    // Check for missing fields
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    let existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .send('A user with that email has already been registered!')
    }

    let profileImagePath = ''
    if (req.file) {
      profileImagePath = req.file.path.replace('public/', '')
    }

    let passwordDigest = await middleware.hashPassword(password)

    const user = await User.create({
      username,
      email,
      img: req.file ? 'uploads/' + req.file.filename : '',
      passwordDigest
    })

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      img: user.img
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error during registration')
  }
}

const Login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).send({ status: 'Error', msg: 'User not found' })
    }

    let matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )
    if (matched) {
      let payload = {
        _id: user._id,
        email: user.email
      }
      let token = middleware.createToken(payload)
      return res.status(200).send({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          img: user.img
        }
      })
    }
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res
      .status(401)
      .send({ status: 'Error', msg: 'An error has occurred logging in!' })
  }
}

const UpdatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    let user = await User.findById(req.params.user_id)

    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found' })
    }

    let matched = await middleware.comparePassword(
      oldPassword,
      user.passwordDigest
    )
    if (matched) {
      let passwordDigest = await middleware.hashPassword(newPassword)
      user = await User.findByIdAndUpdate(
        req.params.user_id,
        { passwordDigest },
        { new: true }
      )
      let payload = {
        _id: user._id,
        email: user.email
      }
      return res
        .status(200)
        .send({ status: 'Password Updated!', user: payload })
    }
    res
      .status(401)
      .send({ status: 'Error', msg: 'Old Password did not match!' })
  } catch (error) {
    console.log(error)
    res.status(401).send({
      status: 'Error',
      msg: 'An error has occurred updating password!'
    })
  }
}

const CheckSession = async (req, res) => {
  try {
    const { payload } = res.locals
    // Find the full user by id from the payload
    const user = await User.findById(payload._id)
    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found' })
    }
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      img: user.img
    })
  } catch (error) {
    console.error(error)
    res.status(500).send({ status: 'Error', msg: 'Session check failed' })
  }
}

const UpdateProfile = async (req, res) => {
  try {
    const { username } = req.body
    let updateFields = { username }

    if (req.file) {
      updateFields.img = 'uploads/' + req.file.filename
    }

    const user = await User.findByIdAndUpdate(
      req.params.user_id,
      updateFields,
      { new: true }
    )

    if (!user) {
      return res.status(404).send({ status: 'Error', msg: 'User not found' })
    }

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      img: user.img
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ status: 'Error', msg: 'An error has occurred updating profile!' })
  }
}

module.exports = {
  Register,
  Login,
  UpdateProfile,
  CheckSession,
  UpdatePassword
}
