import React, { useState } from 'react';
import { Slide, Fade } from 'react-awesome-reveal';

export function ProcessClaim({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [claimId, setClaimId] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        setTxBeingSent("Processing claim...");
        const tx = await nhifContract.processClaim(claimId);
        await tx.wait();
        alert("Claim processed successfully!");
        setClaimId('');
      } catch (error) {
        setTransactionError("Error processing claim: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Process Claim</h4>
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
          <div className="form-group">
            <input
              className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Process Claim"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default ProcessClaim;
