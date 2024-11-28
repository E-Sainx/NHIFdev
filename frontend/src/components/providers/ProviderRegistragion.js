import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";

const counties = [
  "Baringo",
  "Bomet",
  "Bungoma",
  "Busia",
  "Elgeyo-Marakwet",
  "Embu",
  "Garissa",
  "Homa Bay",
  "Isiolo",
  "Kajiado",
  "Kakamega",
  "Kericho",
  "Kiambu",
  "Kilifi",
  "Kirinyaga",
  "Kisii",
  "Kisumu",
  "Kitui",
  "Kwale",
  "Laikipia",
  "Lamu",
  "Machakos",
  "Makueni",
  "Mandera",
  "Marsabit",
  "Meru",
  "Migori",
  "Mombasa",
  "Murang'a",
  "Nairobi",
  "Nakuru",
  "Nandi",
  "Narok",
  "Nyamira",
  "Nyandarua",
  "Nyeri",
  "Samburu",
  "Siaya",
  "Taita-Taveta",
  "Tana River",
  "Tharaka-Nithi",
  "Trans Nzoia",
  "Turkana",
  "Uasin Gishu",
  "Vihiga",
  "Wajir",
  "West Pokot",
];

const ProviderRegistration = ({
  nhifContract,
  setTransactionError,
  setTxBeingSent,
  selectedAddress,
}) => {
  const [providerName, setProviderName] = useState("");
  const [location, setLocation] = useState("");
  const [services, setServices] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        console.log("Registering provider...", selectedAddress, providerName);
        setTxBeingSent("Registering provider...");

        // Estimate gas for the transaction
        const estimatedGas =
          await nhifContract.estimateGas.selfRegisterProvider();

        // Register provider on blockchain
        const tx = await nhifContract.selfRegisterProvider({
          gasLimit: estimatedGas,
        });
        console.log("Transaction sent:", tx.hash);

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction confirmed. Receipt:", receipt);

        if (receipt.status === 0) {
          throw new Error(
            "Transaction failed. Check contract logs for more information.",
          );
        }

        // Store data in MongoDB via backend API
        const response = await axios.post(
          "https://nhifdevbackend.onrender.com/api/registerProvider",
          {
            providerAddress: selectedAddress,
            providerName,
            location,
            services,
            phoneNumber,
            email,
          },
        );

        if (response.status === 200) {
          toast.success("Provider registered successfully!");
          setProviderName("");
          setLocation("");
          setServices("");
          setPhoneNumber("");
          setEmail("");
        } else {
          throw new Error(response.data.error || "Failed to register provider");
        }
      } catch (error) {
        console.error("Detailed error information:", error);

        let errorMessage = "An error occurred. Please try again.";
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          errorMessage = error.response.data.error;
        } else if (error.message) {
          errorMessage = error.message;
        }

        setTransactionError("Error registering provider: " + errorMessage);
        setTxBeingSent(null);
        toast.error("Error registering provider: " + errorMessage);
      }
    } else {
      console.error("Contract not initialized");
      setTransactionError("Contract not initialized");
      toast.error("Contract not initialized");
    }
  };

  // Function to test API manually
  // const testAPI = async () => {
  //   try {
  //     const response = await axios.post(
  //       "https://nhifdevbackend.onrender.com/api/registerProvider",
  //       {
  //         providerAddress: selectedAddress,
  //         providerName,
  //         location,
  //         services,
  //         phoneNumber,
  //         email
  //       }
  //     );
  //     console.log("Response from test API:", response.data);
  //   } catch (error) {
  //     console.error("Test API error:", error);
  //   }
  // };

  return (
    <Slide direction="">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">
          Provider Registration
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Hospital Ethereum Address
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={selectedAddress}
              readOnly
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
              placeholder="Enter Hospital Name"
              required
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <select
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            >
              <option value="" disabled>
                Select County
              </option>
              {counties.map((county) => (
                <option key={county} value={county}>
                  {county}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Type of Facility
            </label>
            <select
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              required
            >
              <option value="" disabled>
                Select Healthcare Facility
              </option>
              <option value="Private Healthcare Facility">
                Private Healthcare Facility
              </option>
              <option value="Public Healthcare Facility">
                Public Healthcare Facility
              </option>
            </select>
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
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Register Provider
            </button>
          </div>
        </form>
      </div>
    </Slide>
  );
};

export default ProviderRegistration;
