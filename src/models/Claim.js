// src/models/Claim.js
const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  nationalId: { type: Number, required: true },
  provider: { type: String, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, required: true },
  ipfsHash: { type: String, required: true },
  status: { type: String, enum: ['Submitted', 'UnderReview', 'Approved', 'Rejected'], required: true }
});

module.exports = mongoose.model('Claim', ClaimSchema);
