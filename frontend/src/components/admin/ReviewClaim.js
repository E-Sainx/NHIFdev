import React, { useState, useEffect } from 'react';
import { Slide } from 'react-awesome-reveal';
import { ethers } from 'ethers';

export function ReviewClaim({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [txBeingSent, setTxBeingSentLocal] = useState(null);
  const exchangeRate = 300000; // Example exchange rate: 1 ETH = 300,000 KES

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      console.log("Fetching claims from the contract...");
      const claimCount = await nhifContract.getClaimsCount();
      const claimsData = [];

      for (let i = 0; i < claimCount; i++) {
        const claim = await nhifContract.claims(i);
        const member = await nhifContract.members(claim.nationalId);

        claimsData.push({
          claimId: i.toString(),
          provider: claim.provider,
          nationalId: claim.nationalId.toString(),
          name: member.name,
          status: claim.status,
          serviceType: claim.serviceType,
          amount: ethers.utils.formatEther(claim.amount), // Convert the amount from Wei to Ether
        });
      }

      setClaims(claimsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching claims:', error);
      setError('Error fetching claims. Please try again later.');
      setLoading(false);
    }
  };

  const statusToString = (status) => {
    switch (status) {
      case 0:
        return 'Submitted';
      case 1:
        return 'Under Review';
      case 2:
        return 'Approved';
      case 3:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'text-gray-500';
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-green-500';
      case 3:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatAmountInKes = (amountInEth) => {
    const amountInKes = parseFloat(amountInEth) * exchangeRate;
    return amountInKes.toFixed(2);
  };

  const handleSubmit = async (event, claimId, status) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        setTxBeingSentLocal("Reviewing claim...");
        const tx = await nhifContract.reviewClaim(claimId, status);
        await tx.wait();
        alert("Claim status updated successfully!");
        fetchClaims();
        setError('');
      } catch (error) {
        console.error("Error reviewing claim:", error);
        let errorMessage = "Error reviewing claim: ";
        if (error.message.includes("execution reverted: Invalid claim ID")) {
          errorMessage += "The claim ID you provided is invalid. Please check the ID and try again.";
        } else if (error.message.includes("cannot estimate gas")) {
          errorMessage += "Cannot estimate gas. The transaction may fail or may require a manual gas limit.";
        } else {
          errorMessage += error.message;
        }
        setError(errorMessage);
        setTxBeingSentLocal(null);
      }
    } else {
      setError("Contract not initialized");
    }
  };

  const handleProcessClaim = async (claimId) => {
    try {
      setTxBeingSentLocal("Processing claim...");
      const tx = await nhifContract.processClaim(claimId);
      await tx.wait();
      alert("Claim processed successfully!");
      fetchClaims();
      setError('');
    } catch (error) {
      console.error("Error processing claim:", error);
      let errorMessage = "Error processing claim: ";
      if (error.message.includes("execution reverted: Invalid claim ID")) {
        errorMessage += "The claim ID you provided is invalid. Please check the ID and try again.";
      } else if (error.message.includes("cannot estimate gas")) {
        errorMessage += "Cannot estimate gas. The transaction may fail or may require a manual gas limit.";
      } else {
        errorMessage += error.message;
      }
      setError(errorMessage);
      setTxBeingSentLocal(null);
    }
  };

  return (
    <Slide direction="up">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-md">
        <h4 className="text-3xl font-bold mb-6 text-blue-600">Review Claims</h4>
        {loading ? (
          <p className="text-center text-gray-500">Loading claims...</p>
        ) : claims.length > 0 ? (
          claims.map((claim) => (
            <div key={claim.claimId} className="mb-6 p-6 border border-gray-200 rounded-md bg-gray-50">
              <p className="text-lg"><strong>Claim ID:</strong> {claim.claimId}</p>
              <p className="text-lg"><strong>Provider Address:</strong> {claim.provider}</p>
              <p className="text-lg"><strong>Member ID:</strong> {claim.nationalId}</p>
              <p className="text-lg"><strong>Member Name:</strong> {claim.name}</p>
              <p className="text-lg"><strong>Service Type:</strong> {claim.serviceType}</p>
              <p className="text-lg text-green-600"><strong>Amount (KES):</strong> {formatAmountInKes(claim.amount)} KES</p>
              <p className={`text-lg ${getStatusColor(claim.status)}`}><strong>Status:</strong> {statusToString(claim.status)}</p>
              <div className="flex justify-around mt-4">
                <button
                  onClick={(e) => handleSubmit(e, claim.claimId, 2)}
                  className="w-40 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Approve
                </button>
                <button
                  onClick={(e) => handleSubmit(e, claim.claimId, 3)}
                  className="w-40 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Reject
                </button>
                <button
                  onClick={(e) => handleSubmit(e, claim.claimId, 1)}
                  className="w-40 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  Under Review
                </button>
                {claim.status === 2 && (
                  <button
                    onClick={() => handleProcessClaim(claim.claimId)}
                    className="w-40 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Process
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No claims found.</p>
        )}
        {error && (
          <div className="mt-4">
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-xs text-gray-500 mt-2">
              For more information, visit{' '}
              <a href="https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Ethers Error Documentation
              </a>.
            </p>
          </div>
        )}
      </div>
    </Slide>
  );
}

export default ReviewClaim;
