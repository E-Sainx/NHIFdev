import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';
import { ethers } from 'ethers';

export function MonthlyContribution({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [monthlyContributionKSH, setMonthlyContributionKSH] = useState('');
  
  // Hardcoded conversion rate
  const conversionRate = 0.000003; // Example conversion rate: 1 KSH = 0.000003 ETH

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        // Convert KSH to ETH
        const monthlyContributionETH = (parseFloat(monthlyContributionKSH) * conversionRate).toFixed(18);
        console.log("Setting monthly contribution in ETH...", monthlyContributionETH);
        setTxBeingSent("Setting monthly contribution...");
        const tx = await nhifContract.setMonthlyContribution(ethers.utils.parseUnits(monthlyContributionETH, 'ether'));
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);
        alert("Monthly contribution set successfully!");
        setMonthlyContributionKSH('');
      } catch (error) {
        console.error("Error setting monthly contribution:", error);
        setTransactionError("Error setting monthly contribution: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      console.error("Contract not initialized");
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Set Monthly Contribution</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">Monthly Contribution (KSH)</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={monthlyContributionKSH}
              onChange={(e) => setMonthlyContributionKSH(e.target.value)}
              placeholder="Enter monthly contribution in KSH"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Set Monthly Contribution"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default MonthlyContribution;
