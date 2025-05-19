const express = require('express');
const { findUsersBySearch, findAllUsers, findUserById, toggleUserStatus } = require('../controllers/userController');
const router = express.Router();

router.get('/search', findUsersBySearch); // Route to search users by username or mail
router.get('/', findAllUsers); // Route to fetch all users
router.get('/:id', findUserById); // Route to fetch a user by ID
router.patch('/:id/toggle-status', toggleUserStatus); // Route to toggle isActive and isVerified for a user

module.exports = router;