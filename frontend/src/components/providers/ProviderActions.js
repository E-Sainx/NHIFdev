import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { create } from "ipfs-http-client";
import { Slide } from "react-awesome-reveal";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// IPFS client setup
const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization:
      "Basic " +
      btoa(
        `${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_PROJECT_SECRET}`,
      ),
  },
});

const ProviderActions = ({ nhifContract, selectedAddress }) => {
  const [nationalId, setNationalId] = useState("");
  const [amountInKES, setAmountInKES] = useState("0");
  const [amountInETH, setAmountInETH] = useState("0.01");
  const [ipfsHash, setIpfsHash] = useState("");
  const [providerAddress, setProviderAddress] = useState("");
  const [transactionError, setTransactionError] = useState(null);
  const [txBeingSent, setTxBeingSent] = useState(null);
  const [isProviderRegistered, setIsProviderRegistered] = useState(false);
  const [serviceType, setServiceType] = useState("Inpatient");

  const exchangeRate = 0.000003;

  useEffect(() => {
    checkProviderRegistration(selectedAddress);
  }, [selectedAddress]);

  const checkProviderRegistration = async (address) => {
    try {
      const registered = await nhifContract.isRegisteredProvider(address);
      setIsProviderRegistered(registered);
      return registered;
    } catch (error) {
      console.error("Error checking provider registration:", error);
      setTransactionError(error.message);
      return false;
    }
  };

  const submitClaim = async () => {
    try {
      const registered = await checkProviderRegistration(selectedAddress);
      if (!registered) {
        toast.error("Provider is not registered.");
        return;
      }

      const amountInETH = (parseFloat(amountInKES) * exchangeRate).toString();
      console.log(
        `Submitting claim for National ID: ${nationalId}, Amount: ${amountInETH} ETH, IPFS Hash: ${ipfsHash}`,
      );

      setTxBeingSent("Submitting claim to blockchain...");

      const tx = await nhifContract.submitClaim(
        nationalId,
        ethers.utils.parseEther(amountInETH),
        ipfsHash,
        serviceType,
        { gasLimit: 300000 },
      );
      console.log(`Transaction sent: ${tx.hash}`);
      await tx.wait();
      console.log(`Transaction confirmed: ${tx.hash}`);

      setTxBeingSent("Storing claim in database...");

      const response = await axios.post(
        "https://nhifdevbackend.onrender.com/api/submitClaim",
        {
          nationalId,
          provider: selectedAddress,
          amount: parseFloat(amountInKES),
          ipfsHash,
          serviceType,
          status: "Submitted",
          transactionHash: tx.hash,
        },
      );

      if (response.status === 200) {
        toast.success(
          "Claim submitted successfully to blockchain and database",
        );
        setNationalId("");
        setAmountInKES("0");
        setIpfsHash("");
      } else {
        throw new Error("Failed to store claim in database");
      }
    } catch (error) {
      console.error("Error submitting claim:", error);
      setTransactionError(error.message);
      toast.error(`Error submitting claim: ${error.message}`);
    } finally {
      setTxBeingSent(null);
    }
  };

  const removeProvider = async () => {
    try {
      console.log(`Removing provider: ${providerAddress}`);
      setTxBeingSent("Removing provider from blockchain...");

      const tx = await nhifContract.removeProvider(providerAddress, {
        gasLimit: 300000,
      });
      await tx.wait();

      setTxBeingSent("Removing provider from database...");

      const response = await axios.delete(
        `https://045428dd-5a8f-488e-96b2-567e1058c25a-00-2yuz97l2q30gi.spock.replit.dev:8000/api/providers/${providerAddress}`,
      );

      if (response.status === 200) {
        toast.success(
          "Provider removed successfully from blockchain and database",
        );
        setProviderAddress("");
      } else {
        throw new Error("Failed to remove provider from database");
      }
    } catch (error) {
      console.error("Error removing provider:", error);
      setTransactionError(error.message);
      toast.error(`Error removing provider: ${error.message}`);
    } finally {
      setTxBeingSent(null);
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await ipfsClient.add(file);
      setIpfsHash(added.path);
      console.log("IPFS Hash:", added.path);
    } catch (error) {
      console.error("Error uploading file to IPFS:", error);
      setTransactionError("Error uploading file to IPFS.");
      toast.error("Error uploading file to IPFS.");
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadToIPFS(file);
    }
  };

  return (
    <Slide direction="">
      <div className="container mx-auto p-6 bg-white shadow-lg rounded-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-600">
          Hospital Actions
        </h2>

        {/* Submit Claim */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Submit Claim</h3>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              National ID
            </label>
            <input
              className="form-control mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter National ID"
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Amount (KES)
            </label>
            <input
              className="form-control mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={amountInKES}
              onChange={(e) => setAmountInKES(e.target.value)}
              placeholder="Enter Amount in KES"
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Service Type
            </label>
            <select
              className="form-control mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
            >
              <option value="Inpatient">Inpatient</option>
              <option value="Outpatients">Outpatients</option>
              <option value="Edu Afya">Edu Afya</option>
              <option value="Linda Mama">Linda Mama</option>
            </select>
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              IPFS Hash
            </label>
            <input
              className="form-control mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={ipfsHash}
              readOnly
              placeholder="IPFS Hash will appear here"
            />
          </div>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Upload Medical File (Optional)
            </label>
            <input
              className="form-control mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group flex justify-center">
            <button
              className="btn bg-green-500 w-60 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={submitClaim}
              disabled={txBeingSent}
            >
              Submit Claim
            </button>
          </div>
        </div>

        {/* Remove Provider */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">
            Remove Hospital Account
          </h3>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Hospital Address
            </label>
            <input
              className="form-control mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={providerAddress}
              onChange={(e) => setProviderAddress(e.target.value)}
              placeholder="Enter Provider Address"
            />
          </div>
          <div className="form-group flex justify-center">
            <button
              className="btn bg-red-500 w-60 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={removeProvider}
              disabled={txBeingSent}
            >
              Remove Hospital
            </button>
          </div>
        </div>

        {transactionError && <p className="text-red-500">{transactionError}</p>}
        {txBeingSent && <p className="text-blue-500">{txBeingSent}</p>}
      </div>
    </Slide>
  );
};

export default ProviderActions;
