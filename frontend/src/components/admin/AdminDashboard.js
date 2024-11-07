import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserPlus, FaUserCheck, FaMoneyBillWave, FaHospital, FaTrash, FaFileAlt, FaClipboardCheck, FaCog, FaCoins, FaCheck, FaList } from 'react-icons/fa';
import NHIF from '../contracts/Token.json'
import { ethers } from 'ethers';


const AdminDashboard = ({ provider, selectedAddress, setTransactionError, setTxBeingSent }) => {
  const contractAddress = '0xa0d7B10035743387b5d683F83a3af7920D110Ca8'; // Replace with your contract address
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">SHA Admin Dashboard</h1>
      <p className="text-lg text-center text-gray-700 mb-12">Welcome to the SHA Admin Dashboard. Here you can manage members and providers efficiently.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Link to="/admin/members/register" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaUserPlus className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Register Member</span>
        </Link>
        <Link to="/admin/members/status" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaUserCheck className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Member Status</span>
        </Link>
        <Link to="/admin/monthly-contribution" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaMoneyBillWave className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Monthly Contribution</span>
        </Link>
        <Link to="/admin/providers/register" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaHospital className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Register Provider</span>
        </Link>
        <Link to="/admin/providers/remove" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaTrash className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Remove Provider</span>
        </Link>
        <Link to="/admin/claims/submit" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaFileAlt className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Submit Claim</span>
        </Link>
        <Link to="/admin/claims/review" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaClipboardCheck className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Review Claim</span>
        </Link>
        <Link to="/admin/claims/process" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaCog className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Process Claim</span>
        </Link>
        <Link to="/admin/claims/count" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaCoins className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Claims Count</span>
        </Link>
        <Link to="/admin/withdraw-funds" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaCheck className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Withdraw Funds</span>
        </Link>
        <Link to="/admin/providers/check" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaHospital className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Check Provider</span>
        </Link>
        <Link to="/admin/claims/list" className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center hover:bg-blue-100">
          <FaList className="text-4xl text-blue-600 mb-4" />
          <span className="text-xl font-semibold text-blue-800">Claim List</span>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
