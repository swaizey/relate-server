const userModel = require('../model/userModel');

// Controller to find users by matching characters in mail or username
const findUsersBySearch = async (req, res) => {
  const { search } = req.query; // Get the search query from the request

  try {
    const users = await userModel.find({
      $or: [
        { username: { $regex: search, $options: 'i' } }, // Case-insensitive search in username
        { mail: { $regex: search, $options: 'i' } }, // Case-insensitive search in mail
      ],
    });
    const sanitizedUsers = users.map((user) => {
        const { password, ...otherDetails } = user.toObject();
        return otherDetails;
      });
    res.status(200).json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error finding users', error: error.message });
  }
};

// Controller to find all users
const findAllUsers = async (req, res) => {
  const { page = 1, limit = 2 } = req.query; // Default to page 1 and limit 10

  try {
    const users = await userModel
      .find()
      .skip((page - 1) * limit) // Skip users for previous pages
      .limit(Number(limit)); // Limit the number of users per page

    const sanitizedUsers = users.map((user) => {
      const { password, ...otherDetails } = user.toObject();
      return otherDetails;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Controller to find a user by ID
const findUserById = async (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters

  try {
    const user = await userModel.findById(id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...otherDetails } = user.toObject();

    res.status(200).json(otherDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error finding user', error: error.message });
  }
};

// Controller to toggle isActive and isVerified for a user
const toggleUserStatus = async (req, res) => {
  const { id } = req.params; // Get the user ID from the request parameters
  const { isActive, isVerified } = req.body; // Get the status fields from the request body

  try {
    const user = await userModel.findById(id); // Find user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the isActive and isVerified fields
    if (typeof isActive !== 'undefined') user.isActive = isActive;
    if (typeof isVerified !== 'undefined') user.isVerified = isVerified;

    await user.save(); // Save the updated user

    const { password, ...otherDetails } = user.toObject();
    res.status(200).json(otherDetails);
  } catch (error) {
    res.status(500).json({ message: 'Error toggling user status', error: error.message });
  }
};

module.exports = {
  findUsersBySearch,
  findAllUsers,
  findUserById,
  toggleUserStatus,
};