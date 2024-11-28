import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

const ClaimList = ({ nhifContract }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const exchangeRate = 300000; // Example exchange rate: 1 ETH = 300,000 KES

  // Set to keep track of already fetched claim IDs to avoid duplicates
  const [fetchedClaims, setFetchedClaims] = useState(new Set());

  useEffect(() => {
    fetchClaims();
  }, [nhifContract, page]);

  const fetchClaims = async () => {
    if (nhifContract) {
      try {
        setLoading(true);

        const claimCount = await nhifContract.getClaimsCount();
        const startIndex = Math.max(0, claimCount - page * pageSize);
        const endIndex = Math.max(0, claimCount - (page - 1) * pageSize);
        const blockchainClaims = [];

        for (let i = startIndex; i < endIndex; i++) {
          const claim = await nhifContract.claims(i);

          // Skip duplicate claims based on claimId
          if (fetchedClaims.has(i)) continue;

          blockchainClaims.push({
            claimId: i,
            nationalId: claim.nationalId.toString(),
            provider: claim.provider,
            amount: ethers.utils.formatEther(claim.amount),
            ipfsHash: claim.ipfsHash,
            status: claim.status,
            serviceType: claim.serviceType,
            timestamp: Date.now(), // Use current timestamp as we don't have it from blockchain
          });

          // Mark the claim as fetched by adding its ID to the set
          fetchedClaims.add(i);
        }

        // Add new claims to the state
        setClaims((prevClaims) => [...prevClaims, ...blockchainClaims]);

        setHasMore(endIndex < claimCount);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching claims:", error);
        setError("Failed to fetch claims. Please try again.");
        setLoading(false);
      }
    }
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const statusToString = (status) => {
    switch (status) {
      case 0:
        return "Submitted";
      case 1:
        return "Under Review";
      case 2:
        return "Approved";
      case 3:
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "text-gray-500";
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-green-500";
      case 3:
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const formatAmountInKes = (amountInEth) => {
    const amountInKes = parseFloat(amountInEth) * exchangeRate;
    return amountInKes.toFixed(2);
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-center text-blue-900 mb-4">
        Claim List
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Claim ID
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Member ID
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Provider
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Amount (KES)
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                IPFS Hash
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Status
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Service Type
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim) => (
              <tr key={claim.claimId}>
                <td className="py-2 px-4 border-b border-gray-200">
                  {claim.claimId}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {claim.nationalId}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {claim.provider}
                </td>
                <td className="py-2 px-4 border-b border-gray-200 text-green-600">
                  {formatAmountInKes(claim.amount)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {claim.ipfsHash}
                </td>
                <td
                  className={`py-2 px-4 border-b border-gray-200 ${getStatusColor(claim.status)}`}
                >
                  {statusToString(claim.status)}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {claim.serviceType}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {new Date(claim.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div className="text-center mt-4">Loading...</div>}
      {!loading && hasMore && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ClaimList;
