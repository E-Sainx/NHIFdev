import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NHIF from '../contracts/Token.json';
import AdminActions from './AdminActions';
import AdminDashboard from './AdminDashboard';
import MemberRegistration from '../members/MemberRegistration';
import MemberStatus from '../members/MemberStatus';
import MonthlyContribution from '../MonthlyContribution';
import ProviderRegistration from '../providers/ProviderRegistragion';
import RemoveProvider from '../RemoveProvider';
import SubmitClaim from '../SubmitClaim';
import ReviewClaim from './ReviewClaim';
import ProcessClaim from '../ProcessClaim';
import ClaimsCount from '../ClaimsCount';
import WithdrawFunds from '../WithdrawFunds';
import CheckProvider from '../CheckProvider';
import ClaimList from './ClaimList';

const contractAddress = '0x04F607DF0A0CA5B7a3992F9F5F3657aE3Ce4e6a3';

export function Admin({ provider, selectedAddress }) {
  const [nhifContract, setNHIFContract] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [txBeingSent, setTxBeingSent] = useState(null);

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
  }, [provider]);

  useEffect(() => {
    if (transactionError) {
      toast.error(transactionError);
      setTransactionError(null);
    }
  }, [transactionError]);

  useEffect(() => {
    if (txBeingSent) {
      toast.info(`Transaction sent: ${txBeingSent}`);
      setTxBeingSent(null);
    }
  }, [txBeingSent]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-customBlue text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              NHIF Admin Dashboard
            </Link>
            <div>
              <h1 className="text-xl font-bold">NHIF Management System</h1>
              <p>Welcome <b>{selectedAddress}</b></p>
            </div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/admin/dashboard" className="hover:text-gray-200">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/actions" className="hover:text-gray-200">
                  Admin Actions
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex-grow container mx-auto p-4">
          <Routes>
            <Route
              path="/"
              element={
                <AdminDashboard
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminDashboard
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/actions"
              element={
                <AdminActions
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/members/register"
              element={
                <MemberRegistration
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/members/status"
              element={
                <MemberStatus
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/monthly-contribution"
              element={
                <MonthlyContribution
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/providers/register"
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
              path="/admin/providers/remove"
              element={
                <RemoveProvider
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/claims/submit"
              element={
                <SubmitClaim
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/claims/review"
              element={
                <ReviewClaim
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/claims/process"
              element={
                <ProcessClaim
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/claims/count"
              element={
                <ClaimsCount
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/withdraw-funds"
              element={
                <WithdrawFunds
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/providers/check"
              element={
                <CheckProvider
                  nhifContract={nhifContract}
                  selectedAddress={selectedAddress}
                  setTransactionError={setTransactionError}
                  setTxBeingSent={setTxBeingSent}
                />
              }
            />
            <Route
              path="/admin/claims/list"
              element={
                <ClaimList
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

export default Admin;
