import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProviderRegistration = ({
  nhifContract,
  setTransactionError,
  setTxBeingSent,
}) => {
  const [providerAddress, setProviderAddress] = useState("");
  const [providerName, setProviderName] = useState("");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        if (!/^0x[a-fA-F0-9]{40}$/.test(providerAddress)) {
          throw new Error("Invalid Ethereum address");
        }

        console.log("Registering provider...", providerAddress, providerName);
        setTxBeingSent("Registering provider...");

        // Estimate gas
        const estimatedGas = await nhifContract.estimateGas.registerProvider(providerAddress);

        // Register provider on blockchain
        const tx = await nhifContract.registerProvider(providerAddress, {
          gasLimit: estimatedGas,
        });
        console.log("Transaction sent:", tx.hash);
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Receipt:", receipt);

        if (receipt.status === 0) {
          throw new Error(
            "Transaction failed. Check contract logs for more information."
          );
        }

        // Store data in MongoDB via backend API
        const response = await axios.post(
          "https://bcf4d219-6438-45ba-97b4-971f839c9102-00-2thi2cnf7fchk.picard.replit.dev:5000/api/registerProvider", // Update with your backend URL
          {
            providerAddress,
            providerName,
            location,
            services,
            phoneNumber,
            email,
          }
        );

        if (response.status === 200) {
          toast.success("Provider registered successfully!");
          setProviderAddress("");
          setProviderName("");
          setLocation("");
          setServices("");
          setPhoneNumber("");
          setEmail("");
        } else {
          throw new Error(
            response.data.error || "Failed to register provider"
          );
        }
      } catch (error) {
        console.error("Error registering provider:", error);
        setTransactionError("Error registering provider: " + error.message);
        setTxBeingSent(null);
        toast.error("Error registering provider: " + error.message);
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
        <h4 className="text-2xl font-bold mb-4 text-customBlue">
          Provider Registration
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Provider Ethereum Address
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder="Enter Provider Ethereum Address"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Provider Name
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={providerName}
              onChange={(e) => setProviderName(e.target.value)}
              placeholder="Enter Provider Name"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter Location"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Services
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              placeholder="Enter Services"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter Phone Number"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="form-group flex justify-center">
            <input
              className="btn bg-customBlue w-60 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Register Provider"
            />
          </div>
        </form>
      </div>
    </Slide>
  );
};

export default ProviderRegistration;
