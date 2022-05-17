const User = require('../models/user')
const jwt = require('jsonwebtoken')

// 
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(401)
  const refreshToken = cookies.jwt
  console.log('refreshToken', refreshToken);

  const foundUser = await User.findOne({ token: refreshToken })
  console.log('foundUser', foundUser);
  if (!foundUser) return res.sendStatus(403) //Forbidden
  else return res.send(foundUser)

}

module.exports = { handleRefreshToken }
