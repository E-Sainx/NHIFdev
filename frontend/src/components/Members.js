import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import NHIF from '../contracts/Token.json';
import { MemberRegistration } from './MemberRegistration';
import { MemberActions } from './MemberActions';

const contractAddress = '0x95c2Ea24993E2903BDbe3239399D22Ab3Ac4e5DB';

export function Members({ provider, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nhifContract, setNHIFContract] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (provider) {
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, NHIF.abi, signer);
          setNHIFContract(contract);
          console.log("Contract initialized:", contract.address);
        } catch (error) {
          console.error("Failed to initialize contract:", error);
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
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="text-2xl font-bold">
              NHIF Members
            </Link>
            <div className="row">
            <div className="col-12">
              <h1>NHIF Management System</h1>
              <p>Welcome <b>{selectedAddress}</b></p>
            </div>
          </div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/members/register" className="hover:text-gray-200">
                  Register Member
                </Link>
              </li>
              <li>
                <Link to="/members/actions" className="hover:text-gray-200">
                  Member Actions
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex-grow container mx-auto p-4">
          <Routes>
            <Route
              path="/members/register"
              element={
                <MemberRegistration
                  nhifContract={nhifContract}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/members/actions"
              element={
                <MemberActions
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