const express = require('express');
const { ethers } = require('ethers');
const Member = require('../models/Member');
const Claim = require('../models/Claim');
const router = express.Router();
const contractABI = require('../../../artifacts/contracts/NHIF.sol/NHIF.json');

require('dotenv').config();

// Update to use Sepolia network
const provider = new ethers.providers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const nhifContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI.abi, wallet);

// Example route to register a member
router.post('/registerMember', async (req, res) => {
  const { nationalId, name } = req.body;
  try {
    const tx = await nhifContract.registerMember(nationalId, name);
    await tx.wait();
    res.status(200).send({ message: 'Member registered successfully', tx });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to register member' });
  }
});

// Define additional routes here

module.exports = router;
