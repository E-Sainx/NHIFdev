import React, { useState, useEffect } from 'react';
import { Slide } from 'react-awesome-reveal';
import { ethers } from 'ethers';

const WithdrawClaim = ({ nhifContract, setTransactionError, setTxBeingSent }) => {
  const [providerAddress, setProviderAddress] = useState('');
  const [providerBalance, setProviderBalance] = useState('0');

  useEffect(() => {
    if (nhifContract && providerAddress) {
      fetchProviderBalance();
    }
  }, [nhifContract, providerAddress]);

  const fetchProviderBalance = async () => {
    try {
      const balance = await nhifContract.getProviderBalance(providerAddress);
      setProviderBalance(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error("Error fetching provider balance:", error);
      setTransactionError("Error fetching provider balance: " + error.message);
    }
  };

  const handleFetchBalance = () => {
    if (nhifContract && providerAddress) {
      fetchProviderBalance();
    } else {
      setTransactionError("Contract or provider address not initialized");
    }
  };

  const handleWithdraw = async () => {
    if (nhifContract && providerAddress) {
      try {
        console.log("Withdrawing all claim funds for provider:", providerAddress);
        setTxBeingSent("Withdrawing claim funds...");
        const amount = ethers.utils.parseEther(providerBalance); // Convert balance to wei
        const tx = await nhifContract.providerWithdraw(amount);
        await tx.wait();
        setTxBeingSent(null);
        alert("Claim funds withdrawn successfully!");
        fetchProviderBalance(); // Update balance after withdrawal
      } catch (error) {
        console.error("Error withdrawing claim funds:", error);
        setTransactionError("Error withdrawing claim funds: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      setTransactionError("Contract or provider address not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Withdraw Claim Funds</h4>
        <div className="form-group mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Provider Ethereum Address
          </label>
          <input
            className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            type="text"
            value={providerAddress}
            onChange={(e) => setProviderAddress(e.target.value)}
            placeholder="Enter Provider Ethereum Address"
            required
          />
        </div>
        <div className="form-group flex justify-center mb-4">
          <button
            className="btn bg-customBlue w-60 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleFetchBalance}
          >
            Fetch Balance
          </button>
        </div>
        <div className="mb-4">
          <h5 className="text-lg font-semibold text-gray-800">Provider Balance:</h5>
          <p className="text-xl font-bold text-gray-900">{providerBalance} ETH</p>
        </div>
        <div className="form-group flex justify-center">
          <button
            className="btn bg-customBlue w-60 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleWithdraw}
          >
            Withdraw All Funds
          </button>
        </div>
      </div>
    </Slide>
  );
}

export default WithdrawClaim;
