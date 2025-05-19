const Request = require('../model/requestModel'); // Import the Request model
const geolib = require('geolib'); // Import geolib for geolocation calculations
const userModel = require('../model/userModel');

// Updated createRequest to find the closest user
const createRequest = async (req, res) => {
  try {
    const { posterId, username, address, natureOfRequest, gender, location, offer, ageRange, latitude, longitude } = req.body;

    console.log('Request payload:', req.body); // Debug log to verify request payload

    // Create a new request
    const newRequest = new Request({
      posterId,
      username,
      address,
      natureOfRequest,
      gender,
      location,
      offer,
      ageRange,
      latitude,
      longitude,
    });

    const savedRequest = await newRequest.save();

    // Find the closest user
    const users = await userModel.find({ _id: { $ne: posterId } }); // Exclude the requester
    const closestUser = geolib.findNearest(
      { latitude, longitude },
      users.map((user) => ({
        latitude: user.latitude,
        longitude: user.longitude,
        userId: user._id,
      }))
    );

    console.log('Request latitude and longitude:', latitude, longitude); // Log request location
    console.log('Closest user:', closestUser); // Log closest user details

    if (closestUser) {
      const connectedUser = await userModel.findById(closestUser.userId);
      return res.status(201).json({
        message: 'Request created and closest user found',
        request: savedRequest,
        closestUser: connectedUser,
      });
    }

    res.status(201).json({
      message: 'Request created but no nearby users found',
      request: savedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
};

const toggleRequestDone = async (req, res) => {
  try {
    const { id } = req.params; // Get the request ID from the URL
    const request = await Request.findById(id); // Find the request by ID
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Check if the user is the request creator or an admin
    if (req.user.id !== request.posterId.toString() || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Unauthorized to toggle this request' });
    }

    // Toggle the "done" field
    request.done = !request.done;
    const updatedRequest = await request.save(); // Save the updated request

    res.status(200).json(updatedRequest); // Return the updated request
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle request', error: error.message });
  }
};

// Get all requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate('posterId', 'profilePic'); // Fetch all requests from the database
    res.status(200).json(requests); // Return the requests
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch requests', error: error.message });
  }
};

// Get a request by ID
const getRequestById = async (req, res) => {
  try {
    const { id } = req.params; // Get the request ID from the URL
    const request = await Request.findById(id).populate('posterId', 'profilePic'); // Fetch the request by ID

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json(request); // Return the request
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch request', error: error.message });
  }
};

// Delete a request
const deleteRequest = async (req, res) => {
  try {
    const { id } = req.params; // Get the request ID from the URL
    const request = await Request.findByIdAndDelete(id); // Delete the request by ID

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.status(200).json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete request', error: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getRequestById,
  deleteRequest,
  toggleRequestDone
};