const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller')

router.post('/signup', UserController.createUser)

router.post('/login', UserController.loginUser)

module.exports = router;
