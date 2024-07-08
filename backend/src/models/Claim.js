const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  nationalId: { type: Number, required: true },
  provider: { type: String, required: true },
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, required: true },
  ipfsHash: { type: String, required: true },
  status: { type: String, required: true },
});

const Claim = mongoose.model('Claim', claimSchema);
module.exports = Claim;
