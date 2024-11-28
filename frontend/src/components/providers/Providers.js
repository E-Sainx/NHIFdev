import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from "react-router-dom";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NHIF from "../contracts/Token.json";
import ProviderRegistration from "./ProviderRegistragion";
import ProviderActions from "./ProviderActions";
import ProviderLanding from "./ProviderLanding";
import WithdrawClaim from "./WithdrawClaim";

const contractAddress = "0x6744557C36898D3B140320Eb0f223736E1542e56";

export function Providers({ provider, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nhifContract, setNHIFContract] = useState(null);

  useEffect(() => {
    const initializeContract = async () => {
      if (provider) {
        try {
          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, NHIF.abi, signer);
          setNHIFContract(contract);
          toast.success("Contract initialized successfully.");
        } catch (error) {
          const errorMessage = `Failed to initialize contract: ${error.message}`;
          setTransactionError(errorMessage);
          toast.error(errorMessage);
        }
      }
    };

    initializeContract();
  }, [provider, setTransactionError]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <ToastContainer position="top-right" autoClose={5000} />
        <nav className="bg-customBlue text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/provider/landing" className="text-2xl font-bold">
              SHA Healthcare Providers
            </Link>
            <div className="text-right">
              <h1 className="text-xl font-bold">SHA Management System</h1>
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
              <li>
                <Link to="/providers/withdraw" className="hover:text-gray-200">
                  Withdraw Funds
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex-grow container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/provider/landing" />} />
            <Route
              path="/provider/landing"
              element={
                <ProviderLanding
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/providers/register"
              element={
                <ProviderRegistration
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
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
            <Route
              path="/providers/withdraw"
              element={
                <WithdrawClaim
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
