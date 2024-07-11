import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const ClaimList = ({ nhifContract }) => {
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    const fetchClaims = async () => {
      if (nhifContract) {
        try {
          const claimCount = await nhifContract.getClaimsCount();
          const claimList = [];
          for (let i = 0; i < claimCount; i++) {
            const claim = await nhifContract.claims(i);
            claimList.push(claim);
          }
          setClaims(claimList);
        } catch (error) {
          console.error("Error fetching claims:", error);
        }
      }
    };

    fetchClaims();
  }, [nhifContract]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">Claim List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {claims.map((claim, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6">
            <p><strong>National ID:</strong> {claim.nationalId}</p>
            <p><strong>Provider:</strong> {claim.provider}</p>
            <p><strong>Amount:</strong> {ethers.utils.formatEther(claim.amount)} ETH</p>
            <p><strong>IPFS Hash:</strong> {claim.ipfsHash}</p>
            <p><strong>Status:</strong> {claim.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClaimList;
