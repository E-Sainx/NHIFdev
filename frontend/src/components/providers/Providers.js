import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NHIF from '../../contracts/Token.json';
import ProviderRegistration from './ProviderRegistragion'; // Corrected import
import ProviderActions from './ProviderActions'; // Corrected import

const contractAddress = '0x95c2Ea24993E2903BDbe3239399D22Ab3Ac4e5DB'; // Replace with your contract address

export function Providers({ provider, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nhifContract, setNHIFContract] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (provider) {
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, NHIF.abi, signer);
          setNHIFContract(contract);
        } catch (error) {
          setTransactionError("Failed to initialize contract: " + error.message);
        }
      }
    };

    initializeContract();
  }, [provider, setTransactionError]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-customBlue text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              NHIF Providers
            </Link>
            <div>
              <h1 className="text-xl font-bold">NHIF Management System</h1>
              <p>Welcome <b>{selectedAddress}</b></p>
            </div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/providers/register" className="hover:text-gray-200">
                  Register Provider
                </Link>
              </li>
              <li>
                <Link to="/providers/actions" className="hover:text-gray-200">
                  Provider Actions
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex-grow container mx-auto p-4">
          <Routes>
            <Route
              path="/providers/register"
              element={
                <ProviderRegistration
                  nhifContract={nhifContract}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/providers/actions"
              element={
                <ProviderActions
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
export default Providers;
