const express = require("express");
const { ethers } = require("ethers");
require("dotenv").config(); // Ensure this is at the very top

const Member = require("../models/Member");
const Claim = require("../models/Claim");
const Provider = require("../models/Provider");
const router = express.Router();
const contractABI = require("./NHIF.json");

const contractAddress = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
);
console.log("Provider:", provider);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
console.log("Wallet Address:", wallet.address);

const nhifContract = new ethers.Contract(
    contractAddress,
    contractABI.abi,
    wallet,
);
console.log("NHIF Contract Address:", nhifContract.address);

// Example route to register a member
router.post("/registerMember", async (req, res) => {
    const { nationalId, name } = req.body;
    try {
        const tx = await nhifContract.registerMember(nationalId, name);
        await tx.wait();

        // Save member to MongoDB
        const newMember = new Member({
            nationalId,
            name,
            lastContributionDate: null,
            isActive: true,
        });
        await newMember.save();

        res.status(200).send({ message: "Member registered successfully", tx });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to register member" });
    }
});

// Example route to submit a claim
router.post("/submitClaim", async (req, res) => {
    const { nationalId, amount, ipfsHash, provider } = req.body;
    try {
        const tx = await nhifContract.submitClaim(nationalId, amount, ipfsHash);
        await tx.wait();

        // Save claim to MongoDB
        const newClaim = new Claim({
            nationalId,
            provider,
            amount,
            isPaid: false,
            ipfsHash,
            status: "Submitted",
        });
        await newClaim.save();

        res.status(200).send({ message: "Claim submitted successfully", tx });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to submit claim" });
    }
});

// Example route to register a provider
router.post("/registerProvider", async (req, res) => {
    const {
        providerAddress,
        providerName,
        location,
        services,
        phoneNumber,
        email,
    } = req.body;
    try {
        if (!/^0x[a-fA-F0-9]{40}$/.test(providerAddress)) {
            throw new Error("Invalid Ethereum address");
        }

        // Register provider on blockchain
        const tx = await nhifContract.registerProvider(providerAddress, {
            gasLimit: 300000,
        });
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Receipt:", receipt);

        if (receipt.status === 0) {
            throw new Error(
                "Transaction failed. Check contract logs for more information.",
            );
        }

        // Save provider to MongoDB
        const newProvider = new Provider({
            providerAddress,
            providerName,
            location,
            services,
            phoneNumber,
            email,
        });
        await newProvider.save();

        res.status(200).send({
            message: "Provider registered successfully",
            tx,
        });
    } catch (error) {
        console.error("Error registering provider:", error);
        res.status(500).send({ error: "Failed to register provider" });
    }
});

// Example route to get member details
router.get("/member/:nationalId", async (req, res) => {
    const { nationalId } = req.params;
    try {
        const member = await Member.findOne({ nationalId });
        res.status(200).send(member);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to get member details" });
    }
});

// Example route to get claims for a member
router.get("/claims/:nationalId", async (req, res) => {
    const { nationalId } = req.params;
    try {
        const claims = await Claim.find({ nationalId });
        res.status(200).send(claims);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to get claims" });
    }
});

// Route to get all providers
router.get("/providers", async (req, res) => {
    try {
        const providers = await Provider.find();
        res.status(200).send(providers);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send({ error: "Failed to get providers" });
    }
});

module.exports = router;
