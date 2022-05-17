const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const register = async (req, res) => {
  // Our register logic starts here
  try {
    // Get user input
    const { username, password } = req.body

    // Validate user input
    if (!(username && password)) {
      res.status(400).send('Both inputs required!')
      return
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ username })

    if (oldUser) {
      return res.status(409).send('User Already Exist!')
      return
    }

    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10)

    // Create user in our database
    const user = await User.create({
      username: username.toLowerCase(), // sanitize: convert username to lowercase
      password: encryptedPassword,
    })

    // Create token
    const token = jwt.sign(
      { user_id: user._id, username },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      },
    )
    // save user token
    user.token = token

    // return new user
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
  }
  // Our register logic ends here
}

const login = async (req, res) => {
  console.log('login')
  // Our login logic starts here
  try {
    // Get user input
    const username = req.body.username
    const password = req.body.password
    console.log(username, password)
    // Validate user input
    if (!(username && password)) {
      res.status(400).send('Both inputs required!')
      return
    }

    // Validate if user exist in our database
    const user = await User.findOne({ username })

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, username },
        process.env.TOKEN_KEY,
        {
          expiresIn: '100s',
        },
      )

      // save user token
      user.token = token
      await user.save()

      // Creates Secure Cookie with refresh token
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 24 * 60 * 60 * 1000,
      })

      // user
      res.status(200).json(user)
      return
    }
    console.log('im here')
    res.status(400).send('User Not Found!')
  } catch (err) {
    console.log(err)
  }
  // Our register logic ends here
}

const logout = async (req, res) => {
  // Our login logic starts here

  // Check cookies if token exist
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(204)
  const refreshToken = cookies.jwt

  // find user with the access token
  const foundUser = await User.findOne({ token: refreshToken })
  // Clear cookies if not found
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
  }

  // remove access token from user and save to database
  // we do this so no one who has the token till expires can login
  foundUser.token = ''
  const result = await foundUser.save()
  console.log(result)

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  return res.sendStatus(204)
}

module.exports = {
  register,
  login,
  logout,
}
