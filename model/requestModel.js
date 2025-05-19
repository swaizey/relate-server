const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema(
  {
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    natureOfRequest: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    offer: {
      type: String,
      required: true,
    },
    ageRange: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false, // Default value is false
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // Document will expire after 24 hours (86400 seconds)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Request', requestSchema);