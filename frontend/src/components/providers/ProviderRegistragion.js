import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';

const ProviderRegistration = ({ nhifContract, setTransactionError, setTxBeingSent }) => {
  const [providerAddress, setProviderAddress] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        if (!/^0x[a-fA-F0-9]{40}$/.test(providerAddress)) {
          throw new Error("Invalid Ethereum address");
        }

        setTxBeingSent("Registering provider...");
        const tx = await nhifContract.registerProvider(providerAddress, { gasLimit: 300000 });
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Receipt:", receipt);

        if (receipt.status === 0) {
          throw new Error("Transaction failed. Check contract logs for more information.");
        }

        setTxBeingSent(null);
        alert("Provider registered successfully!");
        setProviderAddress('');
      } catch (error) {
        console.error("Error registering provider:", error);
        setTransactionError("Error registering provider: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      console.error("Contract not initialized");
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Provider Registration</h4>
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
          <div className="form-group flex justify-center">
            <input
              className="btn bg-customBlue w-60 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Register Provider"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
};

export default ProviderRegistration;
