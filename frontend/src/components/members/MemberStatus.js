import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import { ethers } from "ethers"; // Import ethers to use formatEther

export function MemberStatus({ nhifContract }) {
  const [nationalId, setNationalId] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [totalContributions, setTotalContributions] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const exchangeRate = 0.000003; // Hardcoded conversion rate: 1 KSH = 0.000003 ETH

  const fetchMemberData = async () => {
    if (nhifContract && nationalId) {
      try {
        // Fetch member status
        const memberStatus = await nhifContract.getMemberStatus(nationalId);

        // Fetch total contributions
        const totalContributionsInWei = await nhifContract.getMemberTotalContributions(nationalId);
        const totalContributionsEth = ethers.utils.formatEther(totalContributionsInWei);
        const totalContributionsKes = (parseFloat(totalContributionsEth) / exchangeRate).toFixed(2);

        setMemberData({
          name: memberStatus[1],
          lastContributionDate: new Date(memberStatus[2].toNumber() * 1000).toLocaleString(),
          isActive: memberStatus[0],
        });
        setTotalContributions({
          eth: totalContributionsEth,
          kes: totalContributionsKes,
        });
      } catch (error) {
        setTransactionError("Error fetching member data: " + error.message);
        setMemberData(null);
        setTotalContributions(null);
      }
    }
  };

  const handleFetchMember = (event) => {
    event.preventDefault();
    fetchMemberData();
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Get Member Status</h4>
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
  <div className="mb-6 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
    <h5 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Member Data</h5>
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <span className="text-gray-600">Name</span>
        <span className="font-semibold text-gray-800">{memberData.name}</span>
      </div>
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <span className="text-gray-600">Last Contribution</span>
        <span className="font-semibold text-gray-800">{memberData.lastContributionDate}</span>
      </div>
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <span className="text-gray-600">Total Contributions (ETH)</span>
        <span className="font-semibold text-gray-800">{totalContributions ? totalContributions.eth : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center border-b border-gray-200 pb-2">
        <span className="text-gray-600">Total Contributions (KES)</span>
        <span className="font-semibold text-gray-800">{totalContributions ? totalContributions.kes : 'N/A'}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Status</span>
        <span className={`font-semibold px-3 py-1 rounded-full text-white ${memberData.isActive ? "bg-green-500" : "bg-red-500"}`}>
          {memberData.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
    </div>
  </div>
)}
        {transactionError && <p className="text-red-500 mt-4">{transactionError}</p>}
      </div>
    </Slide>
  );
}

export default MemberStatus;
