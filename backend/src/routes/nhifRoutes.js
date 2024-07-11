const express = require('express');
const { ethers } = require('ethers');
require('dotenv').config();  // Ensure this is at the very top

const Member = require('../models/Member');
const Claim = require('../models/Claim');
const router = express.Router();
const contractABI = require('../../../artifacts/contracts/NHIF.sol/NHIF.json');

console.log("Alchemy API Key:", process.env.ALCHEMY_API_KEY);
console.log("Contract Address:", process.env.CONTRACT_ADDRESS);
console.log("Private Key:", process.env.PRIVATE_KEY);

const contractAddress = process.env.CONTRACT_ADDRESS;

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
        
        // Save member to MongoDB
        const newMember = new Member({ nationalId, name, lastContributionDate: null, isActive: true });
        await newMember.save();

        res.status(200).send({ message: 'Member registered successfully', tx });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Failed to register member' });
    }
});

// Example route to submit a claim
router.post('/submitClaim', async (req, res) => {
    const { nationalId, amount, ipfsHash, provider } = req.body;
    try {
        const tx = await nhifContract.submitClaim(nationalId, amount, ipfsHash);
        await tx.wait();
        
        // Save claim to MongoDB
        const newClaim = new Claim({ nationalId, provider, amount, isPaid: false, ipfsHash, status: 'Submitted' });
        await newClaim.save();

        res.status(200).send({ message: 'Claim submitted successfully', tx });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Failed to submit claim' });
    }
});

// Example route to get member details
router.get('/member/:nationalId', async (req, res) => {
    const { nationalId } = req.params;
    try {
        const member = await Member.findOne({ nationalId });
        res.status(200).send(member);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Failed to get member details' });
    }
});

// Example route to get claims for a member
router.get('/claims/:nationalId', async (req, res) => {
    const { nationalId } = req.params;
    try {
        const claims = await Claim.find({ nationalId });
        res.status(200).send(claims);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: 'Failed to get claims' });
    }
});

module.exports = router;
