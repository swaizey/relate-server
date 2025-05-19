const express = require('express');
const { createPlan, handlePayment } = require('../controllers/paymentController');
const router = express.Router();

// Route to create a plan
router.post('/create-plan', createPlan);

// Route to handle payment
router.post('/pay', handlePayment); // Updated to handle fixed amounts for plans

module.exports = router;