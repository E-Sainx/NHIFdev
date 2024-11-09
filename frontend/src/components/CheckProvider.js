import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';
import axios from 'axios';

export function CheckProvider({ nhifContract }) {
  const [providerAddress, setProviderAddress] = useState('');
  const [isProviderRegistered, setIsProviderRegistered] = useState(null);
  const [providerData, setProviderData] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  const checkProvider = async () => {
    if (nhifContract && providerAddress) {
      try {
        const isRegistered = await nhifContract.isRegisteredProvider(providerAddress);
        setIsProviderRegistered(isRegistered);
        if (isRegistered) {
          fetchProviderData(providerAddress);
        } else {
          setProviderData(null);
        }
      } catch (error) {
        setTransactionError("Error checking provider: " + error.message);
        setIsProviderRegistered(null);
        setProviderData(null);
      }
    }
  };

  const fetchProviderData = async (address) => {
    try {
      // Make sure the address is being passed correctly in the URL
      const response = await axios.get(`https://045428dd-5a8f-488e-96b2-567e1058c25a-00-2yuz97l2q30gi.spock.replit.dev:8000/api/providers?address=${address}`);
      if (response.data && response.data.length > 0) {
        setProviderData(response.data[0]);
      } else {
        setProviderData(null);
      }
    } catch (error) {
      setTransactionError("Error fetching provider data: " + error.message);
      setProviderData(null);
    }
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    checkProvider();
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-6 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-6 text-customBlue">Check Provider</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-6">
            <label className="block text-sm font-medium text-gray-700">Provider Address</label>
            <input
              className="form-control mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
          <p className="mt-4 text-lg font-semibold">
            Provider is {isProviderRegistered ? <span className="text-green-600">registered</span> : <span className="text-red-600">not registered</span>}.
          </p>
        )}
        {providerData && (
          <div className="mt-6 bg-gray-50 p-6 rounded-md shadow-sm">
            <h5 className="text-xl font-semibold mb-4 text-customBlue">Provider Data</h5>
            <div className="mb-4 p-4 bg-gray-100 rounded-lg shadow-inner">
              <p className="text-lg font-semibold mb-2">
                <span className="text-gray-700">Provider Name:</span>
                <span className="ml-2 text-customBlue">{providerData.providerName}</span>
              </p>
              <p className="text-lg font-semibold mb-2">
                <span className="text-gray-700">Location:</span>
                <span className="ml-2 text-customBlue">{providerData.location}</span>
              </p>
              <p className="text-lg font-semibold mb-2">
                <span className="text-gray-700">Services:</span>
                <span className="ml-2 text-customBlue">{providerData.services}</span>
              </p>
              <p className="text-lg font-semibold mb-2">
                <span className="text-gray-700">Phone Number:</span>
                <span className="ml-2 text-customBlue">{providerData.phoneNumber}</span>
              </p>
              <p className="text-lg font-semibold mb-2">
                <span className="text-gray-700">Email:</span>
                <span className="ml-2 text-customBlue">{providerData.email}</span>
              </p>
            </div>

          </div>
        )}
        {transactionError && <p className="text-red-500 mt-4">{transactionError}</p>}
      </div>
    </Slide>
  );
}

export default CheckProvider;
