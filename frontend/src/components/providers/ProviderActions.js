import React, { useState } from 'react';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';
import { Slide } from 'react-awesome-reveal';

// IPFS client setup
const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + btoa(`${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_PROJECT_SECRET}`),
  },
});



const ProviderActions = ({ nhifContract, selectedAddress }) => {
  const [nationalId, setNationalId] = useState('');
  const [amountInKES, setAmountInKES] = useState('0'); // Default to 0 KES
  const [amountInETH, setAmountInETH] = useState('0.01'); // Default to 0.01 ETH
  const [ipfsHash, setIpfsHash] = useState('');
  const [providerAddress, setProviderAddress] = useState('');
  const [transactionError, setTransactionError] = useState(null);
  const [txBeingSent, setTxBeingSent] = useState(null);
  const [isProviderRegistered, setIsProviderRegistered] = useState(false);

  const exchangeRate = 0.000003; // Hardcoded conversion rate: 1 KES = 0.000003 ETH

  const checkProviderRegistration = async (address) => {
    try {
      const registered = await nhifContract.isRegisteredProvider(address);
      setIsProviderRegistered(registered);
      return registered;
    } catch (error) {
      console.error('Error checking provider registration:', error);
      setTransactionError(error.message);
      return false;
    }
  };

  const submitClaim = async () => {
    try {
      const registered = await checkProviderRegistration(selectedAddress);
      if (!registered) {
        alert('Provider is not registered.');
        return;
      }

      const amountInETH = (parseFloat(amountInKES) * exchangeRate).toString();
      console.log(`Submitting claim for National ID: ${nationalId}, Amount: ${amountInETH} ETH, IPFS Hash: ${ipfsHash}`);
      const tx = await nhifContract.submitClaim(
        nationalId,
        ethers.utils.parseEther(amountInETH), // Convert amount to wei
        ipfsHash,
        { gasLimit: 300000 } // Setting a manual gas limit
      );
      setTxBeingSent(tx.hash);
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log(`Transaction confirmed: ${tx.hash}`);
      alert('Claim submitted successfully');
    } catch (error) {
      console.error('Error submitting claim:', error);
      setTransactionError(error.message);
    } finally {
      setTxBeingSent(null);
    }
  };

  const registerProvider = async () => {
    try {
      console.log(`Registering provider: ${providerAddress}`);
      const tx = await nhifContract.registerProvider(providerAddress, { gasLimit: 300000 });
      setTxBeingSent(tx.hash);
      await tx.wait();
      console.log(`Provider registered: ${providerAddress}`);
      alert('Provider registered successfully');
    } catch (error) {
      console.error('Error registering provider:', error);
      setTransactionError(error.message);
    } finally {
      setTxBeingSent(null);
    }
  };

  const removeProvider = async () => {
    try {
      console.log(`Removing provider: ${providerAddress}`);
      const tx = await nhifContract.removeProvider(providerAddress, { gasLimit: 300000 });
      setTxBeingSent(tx.hash);
      await tx.wait();
      console.log(`Provider removed: ${providerAddress}`);
      alert('Provider removed successfully');
    } catch (error) {
      console.error('Error removing provider:', error);
      setTransactionError(error.message);
    } finally {
      setTxBeingSent(null);
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await ipfsClient.add(file);
      setIpfsHash(added.path);
      console.log('IPFS Hash:', added.path);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      setTransactionError('Error uploading file to IPFS.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadToIPFS(file);
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold mb-4 text-customBlue">Provider Actions</h2>

        {/* Register Provider */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Register Provider</h3>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">Provider Address</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder="Enter Provider Address"
            />
          </div>
          <div className="form-group flex justify-center">
            <button
              className="btn bg-customBlue w-60 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={registerProvider}
              disabled={txBeingSent}
            >
              Register Provider
            </button>
          </div>
        </div>

        {/* Remove Provider */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Remove Provider</h3>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">Provider Address</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder="Enter Provider Address"
            />
          </div>
          <div className="form-group flex justify-center">
            <button
              className="btn bg-customBlue w-60 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={removeProvider}
              disabled={txBeingSent}
            >
              Remove Provider
            </button>
          </div>
        </div>

        {/* Submit Claim */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Submit Claim</h3>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter National ID"
            />
          </div>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={amountInKES}
              onChange={(e) => setAmountInKES(e.target.value)}
              placeholder="Enter Amount in KES"
            />
          </div>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">IPFS Hash</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={ipfsHash}
              readOnly
              placeholder="IPFS Hash will appear here"
            />
          </div>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">Upload File (Optional)</label>
            <input
              className="form-control mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group flex justify-center">
            <button
              className="btn bg-customBlue w-60 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={submitClaim}
              disabled={txBeingSent}
            >
              Submit Claim
            </button>
          </div>
        </div>

        {transactionError && <p className="error">{transactionError}</p>}
        {txBeingSent && <p>Transaction sent: {txBeingSent}</p>}
      </div>
    </Slide>
  );
};

export default ProviderActions;
