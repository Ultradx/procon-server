const jwt = require('jsonwebtoken')

const config = process.env

// Checks if the token hasnt expire and verifies the user
const verifyToken = async (req, res, next) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.sendStatus(401)
  const token = cookies.jwt

  console.log('token', token)
  // const token =
  //   req.body.token || req.query.token || req.headers['x-access-token']

  if (!token) {
    return res.status(403).send('A token is required for authentication')
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY)
    req.user = decoded
  } catch (err) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.status(401).send('Authorization Token Has Expired!')
  }
  return next()
}

module.exports = verifyToken
