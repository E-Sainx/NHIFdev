import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';
import axios from 'axios';

export function MemberRegistration({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        console.log("Registering member...", nationalId, name);
        setTxBeingSent("Registering member...");
        const tx = await nhifContract.registerMember(nationalId, name);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);

        // Store data in MongoDB
        const response = await axios.post('http://localhost:5000/api/registerMember', {
          nationalId,
          name,
        });

        if (response.status === 200) {
          alert("Member registered successfully!");
          setNationalId('');
          setName('');
        } else {
          setTransactionError(response.data.error);
        }
      } catch (error) {
        console.error("Error registering member:", error);
        setTransactionError("Error registering member: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      console.error("Contract not initialized");
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Member Registration</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter National ID"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              required
            />
          </div>
          <div className="form-group">
            <input className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2" type="submit" value="Register Member" />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default MemberRegistration;
