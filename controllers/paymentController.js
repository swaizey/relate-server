const userModel = require('../model/userModel');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const planAmounts = {
  weekly: 1200,
  'two-weeks': 3000,
  monthly: 5000,
  regular: 5000,
  vip: 10000,
  vvip: 20000,
};

const validPaymentMethods = ['transfer', 'atm'];

// Helper function to update membership type
const updateMembershipType = async (userId, membershipType) => {
  try {
    await userModel.findByIdAndUpdate(userId, { membershipType });
  } catch (error) {
    console.error('Error updating membership type:', error);
  }
};

// Controller to create a plan
const createPlan = async (req, res) => {
  const { name, amount } = req.body;

  try {
    const plan = await stripe.products.create({
      name,
    });

    const price = await stripe.prices.create({
      unit_amount: amount * 100, // Convert to kobo
      currency: 'ngn',
      product: plan.id,
    });

    res.status(201).json({ planId: plan.id, priceId: price.id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating plan', error: error.message });
  }
};

// Controller to handle payment
const handlePayment = async (req, res) => {
  const { paymentMethodId, userId, membershipPlan, paymentMethod } = req.body;

  try {
    if (!validPaymentMethods.includes(paymentMethod)) {
      console.error('Invalid payment method:', paymentMethod); // Log invalid payment method
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    const amount = planAmounts[membershipPlan];
    if (!amount) {
      console.error('Invalid membership plan:', membershipPlan); // Log invalid membership plan
      return res.status(400).json({ message: 'Invalid membership plan' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to kobo
      currency: 'ngn',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Disable redirect-based payment methods 'always'
      },
    });

    // Update the user's membership plan after successful payment
    await updateMembershipType(userId, membershipPlan);

    res.status(200).json({ success: true, paymentIntent });
  } catch (error) {
    console.error('Payment failed:', error.message); // Log payment failure
    res.status(500).json({ message: 'Payment failed', error: error.message });
  }
};

module.exports = { createPlan, handlePayment };