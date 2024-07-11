// testEnv.js
require('dotenv').config();

console.log("Alchemy API Key:", process.env.ALCHEMY_API_KEY);
console.log("Contract Address:", process.env.CONTRACT_ADDRESS);
console.log("Private Key:", process.env.PRIVATE_KEY);
console.log("MongoDB URI:", process.env.MONGODB_URI);
