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
          <div className="mb-6 p-4 bg-gray-100 rounded-md shadow-sm">
            <h5 className="text-xl font-semibold mb-4 text-blue-700">Member Data</h5>
            <div className="mb-2">
              <p className="text-sm text-gray-700"><strong>Name:</strong> {memberData.name}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-700"><strong>Last Contribution Date:</strong> {memberData.lastContributionDate}</p>
            </div>
            <div className="mb-2">
              <p className="text-sm text-gray-700"><strong>Total Contributions (ETH):</strong> {totalContributions ? totalContributions.eth : 'N/A'}</p>
              <p className="text-sm text-gray-700"><strong>Total Contributions (KES):</strong> {totalContributions ? totalContributions.kes : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-700"><strong>Active:</strong> <span className={memberData.isActive ? "text-green-600" : "text-red-600"}>{memberData.isActive ? 'Yes' : 'No'}</span></p>
            </div>
          </div>
        )}
        {transactionError && <p className="text-red-500 mt-4">{transactionError}</p>}
      </div>
    </Slide>
  );
}

export default MemberStatus;
