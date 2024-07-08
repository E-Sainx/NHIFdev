const express = require('express');
const { ethers } = require('ethers');
const Member = require('../models/Member');
const Claim = require('../models/Claim');
const router = express.Router();
const contractABI = require('../../../artifacts/contracts/NHIF.sol/NHIF.json');

require('dotenv').config();

const contractAddress = process.env.CONTRACT_ADDRESS;
console.log("Alchemy API Key:", process.env.ALCHEMY_API_KEY);
console.log("Contract Address:", contractAddress);

const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
console.log("Provider:", provider);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log("Wallet Address:", wallet.address);

const nhifContract = new ethers.Contract(contractAddress, contractABI.abi, wallet);
console.log("NHIF Contract Address:", nhifContract.address);

// Example route to register a member
router.post('/registerMember', async (req, res) => {
  const { nationalId, name } = req.body;
  try {
    const tx = await nhifContract.registerMember(nationalId, name);
    await tx.wait();
    res.status(200).send({ message: 'Member registered successfully', tx });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ error: 'Failed to register member' });
  }
});

// Define additional routes here

module.exports = router;
