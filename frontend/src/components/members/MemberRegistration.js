import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function MemberRegistration({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        console.log("Registering member...", nationalId, name);
        setTxBeingSent("Registering member...");

        // Simulate contract registration (replace with actual contract method)
        const tx = await nhifContract.registerMember(nationalId, name);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");

        // Store data in MongoDB via backend API
        const response = await axios.post(
          "https://bcf4d219-6438-45ba-97b4-971f839c9102-00-2thi2cnf7fchk.picard.replit.dev:5000/api/registerMember", // Update with your backend URL
          { nationalId, name }
        );

        console.log("API response:", response);
        if (response.status === 200) {
          toast.success("Member registered successfully!");
          setNationalId("");
          setName("");
        } else {
          throw new Error(response.data.error || "Failed to register member");
        }
      } catch (error) {
        console.error("Error registering member:", error);

        // Display user-friendly error message
        let errorMessage = "An error occurred. Please try again.";
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Update state and show error toast
        setTransactionError("Error registering member: " + errorMessage);
        setTxBeingSent(null);
        toast.error("Error registering member: " + errorMessage);
      }
    } else {
      console.error("Contract not initialized");
      setTransactionError("Contract not initialized");
      toast.error("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
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
          <div className="form-group flex justify-center">
            <input
              className="btn bg-customBlue w-60 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Register Member"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default MemberRegistration;
