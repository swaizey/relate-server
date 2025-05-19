const userModel = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register and log in the user
const register = async (req, res) => {
  const { username, password, firstname, lastname, phone, mail, address } = req.body;
  const profilePicUrl = req.file ? req.file.path : null; // Cloudinary returns the file URL

  try {
    const userExist = await userModel.findOne({ username });
    const mailExist = await userModel.findOne({ mail });
    const phoneExist = await userModel.findOne({ phone });

    if (userExist) {
      return res.status(409).json({ message: 'Username exists' });
    } else if (mailExist) {
      return res.status(409).json({ message: 'Mail exists' });
    } else if (phoneExist) {
      return res.status(409).json({ message: 'Phone number exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      username,
      firstname,
      password: hashed,
      lastname,
      phone,
      mail,
      address,
      profilePic:profilePicUrl
    });

    await user.save();
    // Generate a token that expires in 30 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Set the token in an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });
    
    res.status(201).json({ message: `User with ${user.username} created`, user });
  } catch (error) {
    res.status(500).json({ message: error});
  }
};

// Login the user
const login = async (req, res) => {
  try {
    const { usernameOrmail, password } = req.body;
    const user = await userModel.findOne({
      $or: [{ username: usernameOrmail }, { mail: usernameOrmail }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token that expires in 30 days
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Set the token in an HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Logout the user
const logout = (req, res) => {
    try {
      // Clear the token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
        sameSite: 'Strict', // Prevent CSRF
      });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  
  module.exports = { register, login, logout };
