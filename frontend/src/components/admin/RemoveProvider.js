import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';

export function RemoveProvider({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [providerAddress, setProviderAddress] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        if (!/^0x[a-fA-F0-9]{40}$/.test(providerAddress)) {
          throw new Error("Invalid Ethereum address");
        }
        setTxBeingSent("Removing provider...");
        const tx = await nhifContract.removeProvider(providerAddress, { gasLimit: 300000 });
        await tx.wait();
        alert("Provider removed successfully!");
        setProviderAddress('');
      } catch (error) {
        setTransactionError("Error removing provider: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Remove Provider</h4>
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
              className="btn bg-customBlue w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              type="submit"
              value="Remove Provider"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default RemoveProvider;
