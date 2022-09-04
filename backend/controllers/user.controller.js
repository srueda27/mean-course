const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user.model');

function loginUser(req, res, next) {
  let user

  User.findOne({
    email: req.body.email
  })
    .then(userFound => {
      if (!userFound) {
        res.status(500).json({
          message: 'Invalid authentication credentials!'
        })
      }

      user = userFound
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        res.status(500).json({
          message: 'Invalid authentication credentials!'
        })
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id
        },
        process.env.JWT_KEY,
        {
          expiresIn: '1h'
        }
      )

      res.status(200).json({
        token,
        expiresIn: 3600
      })
    })
    .catch(err => {
      console.log(err)
      return res.status(401).json({
        message: 'Auth failed'
      })
    })
}

function createUser(req, res, next) {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })

      user.save()
        .then(result => {
          res.status(200).json({
            message: "User created",
            result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: 'Invalid authentication credentials!'
          })
        })
    })
}

module.exports = {
  createUser,
  loginUser
}
