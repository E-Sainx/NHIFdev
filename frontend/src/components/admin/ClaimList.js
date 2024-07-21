import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const ClaimList = ({ nhifContract }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  useEffect(() => {
    fetchClaims();
  }, [nhifContract, page]);

  const fetchClaims = async () => {
    if (nhifContract) {
      try {
        setLoading(true);
        
        // Fetch claims from blockchain
        const claimCount = await nhifContract.getClaimsCount();
        const startIndex = Math.max(0, claimCount - page * pageSize);
        const endIndex = Math.max(0, claimCount - (page - 1) * pageSize);
        const blockchainClaims = [];
        
        for (let i = startIndex; i < endIndex; i++) {
          const claim = await nhifContract.claims(i);
          blockchainClaims.push({
            ...claim,
            source: 'blockchain',
            timestamp: Date.now() // Use current timestamp as we don't have it from blockchain
          });
        }

        // Fetch claims from database
        const response = await axios.get(`/api/claims?page=${page}&pageSize=${pageSize}`);
        const dbClaims = response.data.claims.map(claim => ({ ...claim, source: 'database' }));

        // Combine and sort claims
        const allClaims = [...blockchainClaims, ...dbClaims]
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, pageSize);

        setClaims(prevClaims => [...prevClaims, ...allClaims]);
        setHasMore(allClaims.length === pageSize);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching claims:", error);
        setError("Failed to fetch claims. Please try again.");
        setLoading(false);
      }
    }
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (error) return <div className="text-red-500 text-center">{error}</div>;

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
            <p><strong>Source:</strong> {claim.source}</p>
            <p><strong>Timestamp:</strong> {new Date(claim.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {loading && <div className="text-center mt-4">Loading...</div>}
      {!loading && hasMore && (
        <button 
          onClick={loadMore} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default ClaimList;