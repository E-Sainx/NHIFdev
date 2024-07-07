import React, { useState } from 'react';
import { Slide, Fade } from 'react-awesome-reveal';
import { ethers } from 'ethers';


export function WithdrawFunds({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        console.log("Withdrawing funds...", amount);
        setTxBeingSent("Withdrawing funds...");
        const tx = await nhifContract.withdrawFunds(ethers.utils.parseUnits(amount, 'ether'));
        await tx.wait();
        setTxBeingSent(null);
        alert("Funds withdrawn successfully!");
        setAmount('');
      } catch (error) {
        console.error("Error withdrawing funds:", error);
        setTransactionError("Error withdrawing funds: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Withdraw Funds</h4>
        <form onSubmit={handleSubmit}>
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
          <div className="form-group">
            <input
              className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Withdraw Funds"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default WithdrawFunds;
