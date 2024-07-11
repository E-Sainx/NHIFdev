import React, { useState } from 'react';
import { Slide, Fade } from 'react-awesome-reveal';
import { ethers } from 'ethers';


export function SubmitClaim({ nhifContract, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState('');
  const [amount, setAmount] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        console.log(`Submitting claim for National ID: ${nationalId}, Amount: ${amount}, IPFS Hash: ${ipfsHash}`);
        setTxBeingSent("Submitting claim...");
        const tx = await nhifContract.submitClaim(
          nationalId,
          ethers.utils.parseUnits(amount, 'ether'), // Convert amount to wei
          ipfsHash,
          { gasLimit: 300000 }
        );
        console.log(`Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log(`Transaction confirmed: ${tx.hash}`);
        setTxBeingSent(null);
        alert('Claim submitted successfully');
        setNationalId('');
        setAmount('');
        setIpfsHash('');
      } catch (error) {
        console.error("Error submitting claim:", error);
        setTransactionError("Error submitting claim: " + error.message);
        setTxBeingSent(null);
      }
    }
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Submit Claim</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter National ID"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">Amount (ETH)</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter Amount in ETH"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">IPFS Hash</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              placeholder="Enter IPFS Hash"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="btn bg-customBlue w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              type="submit"
              value="Submit Claim"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default SubmitClaim;
