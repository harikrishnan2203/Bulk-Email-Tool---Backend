const express = require('express')
const router = express.Router()
const UserController = require('../Controller/UserController')
const bodyparser = require('body-parser')

// Authentication routes
router.post('/signup', UserController.createUser); // Route for user registration
router.get('/verifyemail/:id', UserController.verifyUser)
router.post('/resetpassword', UserController.resetPassword)   
router.get('/resetpassword/:string', UserController.checkUser)
router.post('/changepassword/:string', UserController.changePassword)
router.post('/login', UserController.login)
router.get('/verify-token', UserController.verifyToken)

module.exports = router;