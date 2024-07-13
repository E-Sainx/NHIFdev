import React, { useState } from 'react';
import { ethers } from 'ethers';
import { Slide } from 'react-awesome-reveal';

export function MemberActions({ nhifContract, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [error, setError] = useState(null);
  const [contributionKSH, setContributionKSH] = useState('');
  const exchangeRate = 0.000003; // Hardcoded conversion rate: 1 KSH = 0.000003 ETH

  const fetchMemberData = async () => {
    if (nhifContract && nationalId) {
      try {
        console.log("Fetching member data...", nationalId);
        const memberStatus = await nhifContract.getMemberStatus(nationalId);
        console.log("Member data received:", memberStatus);
        setMemberData({
          name: memberStatus[1],
          lastContributionDate: new Date(memberStatus[2].toNumber() * 1000).toLocaleString(),
          isActive: memberStatus[0]
        });
      } catch (error) {
        console.error("Error fetching member data:", error);
        setError("Error fetching member data: " + error.message);
        setMemberData(null);
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
        const contributionETH = (parseFloat(contributionKSH) * exchangeRate).toString();
        console.log("Making contribution...", nationalId, contributionETH, "ETH");
        setTxBeingSent("Making contribution...");

        const tx = await nhifContract.makeContribution(nationalId, {
          value: ethers.utils.parseUnits(contributionETH, "ether"), // Convert contribution amount to wei
          gasLimit: ethers.utils.hexlify(100000) // Set manual gas limit (adjust as necessary)
        });

        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);
        alert("Contribution made successfully!");
        fetchMemberData();
        setContributionKSH('');
      } catch (error) {
        console.error("Error making contribution:", error);
        setError("Error making contribution: " + (error.data ? error.data.message : error.message));
        setTxBeingSent(null);
      }
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h4 className="text-2xl font-bold mb-6 text-customBlue">Member Actions</h4>
        <form onSubmit={handleFetchMember} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter National ID"
              required
            />
          </div>
          <div className="flex justify-center">
            <input
              className="w-60 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Fetch Member Data"
            />
          </div>
        </form>

        {memberData && (
          <div className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">
            <h5 className="text-xl font-semibold mb-4 text-blue-700">Member Data</h5>
            <div className="mb-2">
              <p className="text-sm text-gray-700"><strong>Name:</strong> {memberData.name}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-700"><strong>Last Contribution Date:</strong> {memberData.lastContributionDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-700"><strong>Active:</strong> <span className={memberData.isActive ? "text-green-600" : "text-red-600"}>{memberData.isActive ? 'Yes' : 'No'}</span></p>
            </div>

            <h5 className="text-xl font-semibold mt-6 mb-4 text-blue-700">Make Contribution</h5>
            <form onSubmit={handleMakeContribution}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Contribution Amount (KSH)</label>
                <input
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  type="text"
                  value={contributionKSH}
                  onChange={(e) => setContributionKSH(e.target.value)}
                  placeholder="Enter Contribution Amount in KSH (e.g., Ksh 500)"
                  required
                />
              </div>
              <div className="flex justify-center">
                <input
                  className="w-60 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  type="submit"
                  value="Make Contribution"
                />
              </div>
            </form>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </Slide>
  );
}

export default MemberActions;
