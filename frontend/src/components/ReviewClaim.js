import React, { useState } from 'react';
import { Slide, Fade } from 'react-awesome-reveal';

export function ReviewClaim({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [claimId, setClaimId] = useState('');
  const [newStatus, setNewStatus] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        setTxBeingSent("Reviewing claim...");
        const tx = await nhifContract.reviewClaim(claimId, newStatus);
        await tx.wait();
        alert("Claim status updated successfully!");
        setClaimId('');
        setNewStatus('');
      } catch (error) {
        setTransactionError("Error reviewing claim: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Review Claim</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">Claim ID</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              placeholder="Enter Claim ID"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">New Status</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              placeholder="Enter New Status (0 = Submitted, 1 = UnderReview, 2 = Approved, 3 = Rejected)"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Review Claim"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default ReviewClaim;
