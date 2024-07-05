import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export function MemberActions({ nhifContract, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState('');
  const [memberData, setMemberData] = useState(null);
  const [contributionAmount, setContributionAmount] = useState('');

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
        setTransactionError("Error fetching member data: " + error.message);
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
    if (nhifContract && nationalId && contributionAmount) {
      try {
        console.log("Making contribution...", nationalId, contributionAmount);
        setTxBeingSent("Making contribution...");
        const tx = await nhifContract.makeContribution(nationalId, {
          value: ethers.utils.parseEther(contributionAmount)
        });
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);
        alert("Contribution made successfully!");
        fetchMemberData();
        setContributionAmount('');
      } catch (error) {
        console.error("Error making contribution:", error);
        setTransactionError("Error making contribution: " + error.message);
        setTxBeingSent(null);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <h4 className="text-2xl font-bold mb-4">Member Actions</h4>
      <form onSubmit={handleFetchMember} className="mb-4">
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
        <div className="form-group">
          <input
            className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="submit"
            value="Fetch Member Data"
          />
        </div>
      </form>

      {memberData && (
        <div className="mb-4">
          <h5 className="text-xl font-semibold mb-2">Member Data</h5>
          <p><strong>Name:</strong> {memberData.name}</p>
          <p><strong>Last Contribution Date:</strong> {memberData.lastContributionDate}</p>
          <p><strong>Active:</strong> {memberData.isActive ? 'Yes' : 'No'}</p>

          <h5 className="text-xl font-semibold mt-4 mb-2">Make Contribution</h5>
          <form onSubmit={handleMakeContribution}>
            <div className="form-group mb-4">
              <label className="block text-sm font-medium text-gray-700">Contribution Amount (ETH)</label>
              <input
                className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                type="text"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                placeholder="Enter contribution amount"
                required
              />
            </div>
            <div className="form-group">
              <input
                className="btn bg-customBlue w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                type="submit"
                value="Make Contribution"
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
