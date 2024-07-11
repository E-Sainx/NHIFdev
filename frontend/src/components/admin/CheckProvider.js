import React, { useState } from 'react';
import { Slide, Fade } from 'react-awesome-reveal';

export function CheckProvider({ nhifContract }) {
  const [providerAddress, setProviderAddress] = useState('');
  const [isProviderRegistered, setIsProviderRegistered] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  const checkProvider = async () => {
    if (nhifContract && providerAddress) {
      try {
        const isRegistered = await nhifContract.isRegisteredProvider(providerAddress);
        setIsProviderRegistered(isRegistered);
      } catch (error) {
        setTransactionError("Error checking provider: " + error.message);
        setIsProviderRegistered(null);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    checkProvider();
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Check Provider</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">Provider Address</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder="Enter Provider Address"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Check Provider"
            />
          </div>
        </form>
        {isProviderRegistered !== null && (
          <p className="mt-4">
            Provider is {isProviderRegistered ? "registered" : "not registered"}.
          </p>
        )}
        {transactionError && <p className="text-red-500">{transactionError}</p>}
      </div>
    </Slide>
  );
}

export default CheckProvider;
