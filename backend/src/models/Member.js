// src/models/Member.js
const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema({
  nationalId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  lastContributionDate: { type: Date, required: false },
  isActive: { type: Boolean, required: false },
});

module.exports = mongoose.model("Member", MemberSchema);
