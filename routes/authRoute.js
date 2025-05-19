const express = require('express')
const { register, login, logout } = require('../controllers/authController')
const upload = require('../middleware/cloudinary')
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const verifyToken = require('../middleware/verifyToken'); // Middleware to verify token


const router = express.Router();



router.post('/register', upload.single('profilePic'), register);
router.post('/login', login)
router.get('/logout', logout)


module.exports = router