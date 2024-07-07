import React, { useState } from 'react';
import { ethers } from 'ethers';

const AdminActions = ({ nhifContract, setTransactionError, setTxBeingSent }) => {
  const [providerId, setProviderId] = useState('');
  const [memberId, setMemberId] = useState('');

  const handleApproveProvider = async (event) => {
    event.preventDefault();
    if (nhifContract && providerId) {
      try {
        console.log("Approving provider...", providerId);
        setTxBeingSent("Approving provider...");
        const tx = await nhifContract.approveProvider(providerId);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);
        alert("Provider approved successfully!");
        setProviderId('');
      } catch (error) {
        console.error("Error approving provider:", error);
        setTransactionError("Error approving provider: " + error.message);
        setTxBeingSent(null);
      }
    }
  };

  const handleApproveMember = async (event) => {
    event.preventDefault();
    if (nhifContract && memberId) {
      try {
        console.log("Approving member...", memberId);
        setTxBeingSent("Approving member...");
        const tx = await nhifContract.approveMember(memberId);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);
        alert("Member approved successfully!");
        setMemberId('');
      } catch (error) {
        console.error("Error approving member:", error);
        setTransactionError("Error approving member: " + error.message);
        setTxBeingSent(null);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
      <h4 className="text-2xl font-bold mb-4">Admin Actions</h4>
      <form onSubmit={handleApproveProvider} className="mb-4">
        <div className="form-group mb-4">
          <label className="block text-sm font-medium text-gray-700">Provider ID</label>
          <input
            className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            type="text"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            placeholder="Enter Provider ID"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            type="submit"
            value="Approve Provider"
          />
        </div>
      </form>

      <form onSubmit={handleApproveMember} className="mb-4">
        <div className="form-group mb-4">
          <label className="block text-sm font-medium text-gray-700">Member ID</label>
          <input
            className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="Enter Member ID"
            required
          />
        </div>
        <div className="form-group">
          <input
            className="btn bg-customBlue w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            type="submit"
            value="Approve Member"
          />
        </div>
      </form>
    </div>
  );
}

export default AdminActions;
