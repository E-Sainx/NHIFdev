import React, { useState, useEffect } from 'react';
import { Slide, Fade } from 'react-awesome-reveal';

export function ClaimsCount({ nhifContract }) {
  const [claimsCount, setClaimsCount] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  const fetchClaimsCount = async () => {
    if (nhifContract) {
      try {
        const count = await nhifContract.getClaimsCount();
        setClaimsCount(count.toString());
      } catch (error) {
        setTransactionError("Error fetching claims count: " + error.message);
        setClaimsCount(null);
      }
    }
  };

  useEffect(() => {
    fetchClaimsCount();
  }, [nhifContract]);

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Claims Count</h4>
        {claimsCount !== null ? (
          <p className="text-gray-600">Total number of claims: {claimsCount}</p>
        ) : (
          <p className="text-gray-600">Loading claims count...</p>
        )}
        {transactionError && <p className="text-red-500">{transactionError}</p>}
      </div>
    </Slide>
  );
}

export default ClaimsCount;
