const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth')

// Login user
router.post('/generate-auth-token', AuthController.generateAuthToken)

module.exports = router
