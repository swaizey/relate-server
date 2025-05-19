const express = require('express');
const upload = require('../middleware/cloudinary');
const {
  createPost,
  getUserPosts,
  editPost,
  deletePost,
  getAllPosts,
  getPostById, // Import the new controller
} = require('../controllers/postController');
const verifyToken = require('../middleware/verifyToken'); // Middleware to verify user authentication

const router = express.Router();

router.post('/', upload.single('image'), createPost); // Route to create a post
router.put('/:id', editPost); // Route to edit a post by ID
router.delete('/:id', deletePost); // Route to delete a post by ID
router.get('/', getAllPosts); // Route to get all posts
router.get('/:id', getPostById); // Route to get a single post by ID
router.get('/user/:senderId', verifyToken, getUserPosts); // Fetch posts by senderId


module.exports = router;