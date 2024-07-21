import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Slide } from 'react-awesome-reveal';
import { TrendingUp } from 'lucide-react';

export function MemberActions({ nhifContract, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(null);
  const [totalContributions, setTotalContributions] = useState(null);
  const [txStatus, setTxStatus] = useState('');
  const [monthlyContributionKSH, setMonthlyContributionKSH] = useState('');
  const [monthlyContributionETH, setMonthlyContributionETH] = useState('');

  // Updated conversion rate: 1 ETH = 333,333 KSH (as of July 2024)
  const ETH_TO_KSH_RATE = 333333;
  const KSH_TO_ETH_RATE = 1 / ETH_TO_KSH_RATE;

  useEffect(() => {
    const fetchMonthlyContribution = async () => {
      if (nhifContract) {
        try {
          const monthlyContributionWei = await nhifContract.getMonthlyContribution();
          const monthlyContributionETH = ethers.utils.formatEther(monthlyContributionWei);
          const monthlyContributionKSH = parseFloat(monthlyContributionETH) * ETH_TO_KSH_RATE;
          setMonthlyContributionETH(monthlyContributionETH);
          setMonthlyContributionKSH(monthlyContributionKSH.toFixed(2));
        } catch (error) {
          console.error("Error fetching monthly contribution:", error);
          setError("Error fetching monthly contribution: " + error.message);
        }
      }
    };
    fetchMonthlyContribution();
  }, [nhifContract]);

  const fetchMemberData = async () => {
    if (nhifContract && nationalId) {
      try {
        console.log("Fetching member data...", nationalId);
        const memberStatus = await nhifContract.getMemberStatus(nationalId);
        console.log("Member data received:", memberStatus);

        setMemberData({
          name: memberStatus[1],
          lastContributionDate: new Date(memberStatus[2] * 1000).toLocaleString(),
          isActive: memberStatus[0]
        });

        // Fetch and display the member's balance
        const balanceInWei = await nhifContract.getAddressBalance(selectedAddress);
        const balanceInETH = ethers.utils.formatEther(balanceInWei);
        const balanceInKSH = parseFloat(balanceInETH) * ETH_TO_KSH_RATE;
        setBalance({ 
          eth: parseFloat(balanceInETH).toFixed(6), 
          ksh: balanceInKSH.toFixed(2) 
        });

        // Fetch total contributions
        const totalContributionsInWei = await nhifContract.getMemberTotalContributions(nationalId);
        const totalContributionsInETH = ethers.utils.formatEther(totalContributionsInWei);
        const totalContributionsInKSH = parseFloat(totalContributionsInETH) * ETH_TO_KSH_RATE;
        setTotalContributions({ 
          eth: parseFloat(totalContributionsInETH).toFixed(6), 
          ksh: totalContributionsInKSH.toFixed(2) 
        });

        setError(null);
      } catch (error) {
        console.error("Error fetching member data:", error);
        setError("Error fetching member data: " + error.message);
        setMemberData(null);
        setBalance(null);
        setTotalContributions(null);
      }
    }
  };

  const handleFetchMember = (event) => {
    event.preventDefault();
    fetchMemberData();
  };

  const handleMakeContribution = async (event) => {
    event.preventDefault();
    if (nhifContract && nationalId) {
      try {
        const contributionETH = monthlyContributionETH;
        console.log("Making contribution...", nationalId, contributionETH, "ETH");

        setTxBeingSent("Making contribution...");
        setTxStatus('Checking contribution amount...');

        // First, try to estimate the gas to see if the transaction would revert
        try {
          await nhifContract.estimateGas.makeContribution(nationalId, {
            value: ethers.utils.parseEther(contributionETH)
          });
        } catch (estimateError) {
          if (estimateError.message.includes("Incorrect contribution amount")) {
            throw new Error("The contribution amount is not accepted by the contract. Please check the required contribution amount.");
          }
          throw estimateError;
        }

        setTxStatus('Sending transaction...');
        const tx = await nhifContract.makeContribution(nationalId, {
          value: ethers.utils.parseEther(contributionETH),
          gasLimit: 200000 // Set a manual gas limit as estimation might still fail
        });

        console.log("Transaction sent:", tx.hash);
        setTxStatus('Transaction sent. Waiting for confirmation...');
        
        const receipt = await tx.wait();
        console.log("Transaction confirmed", receipt);

        if (receipt.status === 0) {
          throw new Error("Transaction failed. Please check your balance and try again.");
        }

        setTxStatus('Contribution made successfully!');
        fetchMemberData(); // Refresh member data and balance
        setError(null);
      } catch (error) {
        console.error("Error making contribution:", error);
        let errorMessage = "Error making contribution: ";

        if (error.message.includes("Incorrect contribution amount")) {
          errorMessage += "The contribution amount is not accepted by the contract. Please check the required contribution amount.";
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
          errorMessage += "Insufficient funds for the transaction.";
        } else if (error.code === 'UNPREDICTABLE_GAS_LIMIT') {
          errorMessage += "Unable to estimate gas. The transaction may fail.";
        } else if (error.message.includes("user rejected transaction")) {
          errorMessage += "Transaction was rejected by the user.";
        } else {
          errorMessage += error.message || "Unknown error occurred.";
        }

        setError(errorMessage);
        setTxStatus('');
      } finally {
        setTxBeingSent(null);
      }
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-8 bg-white shadow-lg rounded-lg">
        <h4 className="text-3xl font-bold mb-8 text-customBlue text-center">Member Actions</h4>
        <form onSubmit={handleFetchMember} className="mb-8">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2" htmlFor="nationalId">National ID</label>
            <input
              id="nationalId"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter National ID"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full md:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
            >
              Fetch Member Data
            </button>
          </div>
        </form>

        {memberData && (
          <div className="mb-8 p-6 bg-gray-100 rounded-lg shadow-sm">
            <h5 className="text-2xl font-semibold mb-6 text-blue-700">Member Data</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <p className="text-lg text-gray-700"><span className="font-semibold">Name:</span> {memberData.name}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg text-gray-700"><span className="font-semibold">Last Contribution:</span> {memberData.lastContributionDate}</p>
              </div>
              <div className="mb-4">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Active:</span> 
                  <span className={memberData.isActive ? "text-green-600 ml-2 font-semibold" : "text-red-600 ml-2 font-semibold"}>
                    {memberData.isActive ? 'Yes' : 'No'}
                  </span>
                </p>
              </div>
              <div className="mb-4">
                <p className="text-lg text-gray-700"><span className="font-semibold">Wallet Balance:</span> {balance ? `${balance.eth} ETH (${balance.ksh} KSH)` : 'N/A'}</p>
              </div>
              <div className="mb-4 col-span-2">
                <p className="text-lg text-gray-700"><span className="font-semibold">Your Total NHIF Contributions:</span> {totalContributions ? `(${totalContributions.ksh} KSH)` : 'N/A'}</p>
              </div>
              <div className="flex items-center justify-between mb-4">

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Monthly Contribution To Pay</h3>
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-semibold">{monthlyContributionKSH} KSH</p>
          <p className="text-sm opacity-80">{monthlyContributionETH} ETH</p>
        </div>
        </div>
    
            </div>

            <h5 className="text-2xl font-semibold mt-8 mb-6 text-blue-700">Pay Contribution</h5>
            <form onSubmit={handleMakeContribution}>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full md:w-auto bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Pay Contribution
                </button>
              </div>
            </form>
          </div>
        )}
        
        {txStatus && (
          <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-md">
            {txStatus}
          </div>
        )}
        
        {error && (
          <p className="text-red-600 mt-4 text-center text-lg">{error}</p>
        )}
      </div>
    </Slide>
  );
}

export default MemberActions;
