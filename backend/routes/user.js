const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = express.Router();

const User = require('../models/user.model');

router.post('/signup', (req, res, next) => {
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
})

router.post('/login', (req, res, next) => {
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
        'long_secret',
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
})

module.exports = router;
