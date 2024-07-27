import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';
import { ethers } from 'ethers';

export function MonthlyContribution({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [monthlyContributionKSH, setMonthlyContributionKSH] = useState('');
  const [error, setError] = useState(null);

  // Updated conversion rate: 1 ETH = 333,333 KSH (as of July 2024)
  const ETH_TO_KSH_RATE = 333333;
  const KSH_TO_ETH_RATE = 1 / ETH_TO_KSH_RATE;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    if (nhifContract) {
      try {
        const contributionETH = (parseFloat(monthlyContributionKSH) * KSH_TO_ETH_RATE).toFixed(18);
        console.log("Setting monthly contribution...", contributionETH, "ETH");
        setTxBeingSent("Setting monthly contribution...");

        const tx = await nhifContract.setMonthlyContribution(ethers.utils.parseEther(contributionETH), { gasLimit: 300000 });

        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);
        alert(`Monthly contribution set successfully! ${monthlyContributionKSH} KSH (${contributionETH} ETH)`);
        setMonthlyContributionKSH('');
      } catch (error) {
        console.error("Error setting monthly contribution:", error);
        let errorMessage = "Error setting monthly contribution: ";

        if (error.reason) {
          errorMessage += error.reason;
        } else if (error.data && error.data.message) {
          errorMessage += error.data.message;
        } else if (error.message) {
          errorMessage += error.message;
        } else {
          errorMessage += "Unknown error occurred";
        }

        setError(errorMessage);
        setTransactionError(errorMessage);
        setTxBeingSent(null);
      }
    } else {
      setError("Contract not initialized");
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
              type="number"
              value={monthlyContributionKSH}
              onChange={(e) => setMonthlyContributionKSH(e.target.value)}
              placeholder="Enter monthly contribution in KSH"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group mb-4">
            <p className="text-sm text-gray-600">
              Equivalent in ETH: {monthlyContributionKSH ? (parseFloat(monthlyContributionKSH) * KSH_TO_ETH_RATE).toFixed(18) : '0'} ETH
            </p>
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Set Monthly Contribution
            </button>
          </div>
        </form>
        {error && (
          <p className="text-red-600 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
    </Slide>
  );
}

export default MonthlyContribution;
