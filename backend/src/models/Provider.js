const mongoose = require("mongoose");

const ProviderSchema = new mongoose.Schema({
    providerAddress: { type: String, required: true, unique: true },
    providerName: { type: String, required: true },
    location: { type: String, required: true },
    services: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
});

module.exports = mongoose.model("Provider", ProviderSchema);
