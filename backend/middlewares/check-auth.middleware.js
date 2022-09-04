const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      const decodedToken = jwt.verify(token, process.env.JWT_KEY)
      req.userData = {
        email: decodedToken.email,
        userId: decodedToken.userId
      }
    }

    next()
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: 'You are not authenticated' })
  }
}
