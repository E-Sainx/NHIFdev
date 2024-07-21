import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function MemberRegistration({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState("");
  const [name, setName] = useState("");
  const [action, setAction] = useState("register"); // "register" or "deactivate"

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        console.log(`${action === "register" ? "Registering" : "Deactivating"} member...`, nationalId, name);
        setTxBeingSent(`${action === "register" ? "Registering" : "Deactivating"} member...`);

        let tx;
        if (action === "register") {
          tx = await nhifContract.registerMember(nationalId, name);
        } else {
          tx = await nhifContract.deactivateMember(nationalId);
        }
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");

        if (action === "register") {
          // API call for registration
          const response = await axios.post(
            "https://nhifdevbackend.onrender.com/api/registerMember",
            { nationalId, name }
          );

          console.log("API response:", response);
          if (response.status === 200) {
            toast.success("Member registered successfully!");
          } else {
            throw new Error(response.data.error || "Failed to register member");
          }
        } else {
          // Local handling for deactivation (no API call)
          toast.success("Member deactivated successfully!");
        }

        setNationalId("");
        setName("");
      } catch (error) {
        console.error(`Error ${action}ing member:`, error);

        // Display user-friendly error message
        let errorMessage = "An error occurred. Please try again.";
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        // Update state and show error toast
        setTransactionError(`Error ${action}ing member: ${errorMessage}`);
        setTxBeingSent(null);
        toast.error(`Error ${action}ing member: ${errorMessage}`);
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
        <h4 className="text-2xl font-bold mb-4 text-customBlue">Member {action === "register" ? "Registration" : "Deactivation"}</h4>
        <div className="mb-4 flex justify-center space-x-4">
          <button
            onClick={() => setAction("register")}
            className={`px-4 py-2 rounded-md ${
              action === "register"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setAction("deactivate")}
            className={`px-4 py-2 rounded-md ${
              action === "deactivate"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Deactivate
          </button>
        </div>
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
          {action === "register" && (
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
          )}
          <div className="form-group flex justify-center">
            <input
              className={`btn w-60 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                action === "register"
                  ? "bg-customBlue bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                  : "bg-red-500 hover:bg-red-600 focus:ring-red-500"
              }`}
              type="submit"
              value={action === "register" ? "Register Member" : "Deactivate Member"}
            />
          </div>
        </form>
      </div>
    </Slide>
  );
}

export default MemberRegistration;

