const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/verifyToken'); // Middleware to verify the user
const {
  createRequest,
  getAllRequests,
  getRequestById,
  deleteRequest,
  toggleRequestDone
} = require('../controllers/requestController'); // Import the controller functions


// Get all requests
router.get('/', getAllRequests);

// Get a request by ID
router.get('/:id', getRequestById);

// Create a new request
router.post('/', createRequest);
// Delete a request
router.delete('/:id', deleteRequest);
router.patch('/:id/done', toggleRequestDone);

module.exports = router;