const postModel = require('../model/postModel');

// Controller to create a new post
const Post = require('../model/postModel'); // Import the Post model

// Create a new post
const createPost = async (req, res) => {
  const { msg, senderId } = req.body; // Extract caption (msg) and senderId from the request body

  try {
    // Get the image URL from Cloudinary
    const pic = req.file ? req.file.path : null;

    // Save the post to the database
    const post = await Post.create({
      msg,
      pic,
      senderId,
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Controller to edit a post
const editPost = async (req, res) => {
  const { id } = req.params; // Post ID from the request parameters
  const { msg, pic } = req.body; // Updated fields

  try {
    const updatedPost = await postModel.findByIdAndUpdate(
      id,
      { msg, pic },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post updated successfully', post: updatedPost });
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error.message });
  }
};

// Controller to delete a post
const deletePost = async (req, res) => {
  const { id } = req.params; // Post ID from the request parameters

  try {
    const deletedPost = await postModel.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
};

// Controller to get all posts
const getAllPosts = async (req, res) => {
  const { page = 1, limit = 5 } = req.query; // Default to page 1 and limit 10

  try {
    const posts = await postModel.find()
      .populate('senderId', 'username profilePic') // Populate sender details
      .sort({ createdAt: -1 }) // Sort by newest first
      .skip((page - 1) * limit) // Skip posts for previous pages
      .limit(Number(limit)); // Limit the number of posts per page

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};
// Get posts by senderId
const getUserPosts = async (req, res) => {
  const { senderId } = req.params;

  try {
    const posts = await Post.find({ senderId }).sort({ createdAt: -1 }); // Fetch posts by senderId
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user posts', error: error.message });
  }
};

// Controller to get a single post by ID
const getPostById = async (req, res) => {
  const { id } = req.params; // Get the post ID from the request parameters

  try {
    const post = await postModel.findById(id).populate('senderId', 'username mail profilePic'); // Populate sender details
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching post', error: error.message });
  }
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getAllPosts,
  getUserPosts,
  getPostById, // Export the new controller
};