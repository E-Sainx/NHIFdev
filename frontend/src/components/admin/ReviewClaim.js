import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';

export function ReviewClaim({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [claimId, setClaimId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event, status) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        setTxBeingSent("Reviewing claim...");
        const tx = await nhifContract.reviewClaim(claimId, status);
        await tx.wait();
        alert("Claim status updated successfully!");
        setClaimId('');
        setError(''); // Clear error on successful transaction
      } catch (error) {
        console.error("Error reviewing claim:", error);

        // Extract and format the error message
        let errorMessage = "Error reviewing claim: ";
        if (error.message.includes("execution reverted: Invalid claim ID")) {
          errorMessage += "The claim ID you provided is invalid. Please check the ID and try again.";
        } else if (error.message.includes("cannot estimate gas")) {
          errorMessage += "Cannot estimate gas. The transaction may fail or may require a manual gas limit.";
        } else {
          errorMessage += error.message;
        }

        setError(errorMessage);
        setTxBeingSent(null);
      }
    } else {
      setError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-6 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-6 text-customBlue">Review Claim</h4>
        <form onSubmit={(e) => handleSubmit(e, 0)} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Claim ID</label>
            <input
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              placeholder="Enter Claim ID"
              required
            />
          </div>
          <div className="flex justify-around mb-4">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 2)}
              className="w-40 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 3)}
              className="w-40 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, 1)}
              className="w-40 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Under Review
            </button>
          </div>
        </form>
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
