const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  nationalId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  lastContributionDate: { type: Date, required: true },
  isActive: { type: Boolean, required: true },
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
