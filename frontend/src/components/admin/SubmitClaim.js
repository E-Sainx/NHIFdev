import React, { useState } from 'react';
import { Slide } from 'react-awesome-reveal';
import { ethers } from 'ethers';
import { create } from 'ipfs-http-client';

// IPFS client setup
const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: 'Basic ' + btoa(`${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_PROJECT_SECRET}`),
  },
});

export function SubmitClaim({ nhifContract, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState('');
  const [amountInKES, setAmountInKES] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [file, setFile] = useState(null);

  const exchangeRate = 0.000003; // Conversion rate: 1 KES = 0.000003 ETH

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        const amountInETH = (parseFloat(amountInKES) * exchangeRate).toString();
        console.log(`Submitting claim for National ID: ${nationalId}, Amount: ${amountInETH} ETH, IPFS Hash: ${ipfsHash}`);
        setTxBeingSent("Submitting claim...");
        const tx = await nhifContract.submitClaim(
          nationalId,
          ethers.utils.parseUnits(amountInETH, 'ether'), // Convert amount to wei
          ipfsHash,
          { gasLimit: 300000 }
        );
        console.log(`Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log(`Transaction confirmed: ${tx.hash}`);
        setTxBeingSent(null);
        alert('Claim submitted successfully');
        setNationalId('');
        setAmountInKES('');
        setIpfsHash('');
      } catch (error) {
        console.error("Error submitting claim:", error);
        setTransactionError("Error submitting claim: " + error.message);
        setTxBeingSent(null);
      }
    }
  };

  const uploadToIPFS = async (file) => {
    try {
      const added = await ipfsClient.add(file);
      setIpfsHash(added.path);
      console.log('IPFS Hash:', added.path);
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      setTransactionError('Error uploading file to IPFS.');
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      uploadToIPFS(file);
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <h3 className="text-xl font-semibold mb-2">Submit Claim</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">National ID</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              placeholder="Enter National ID"
            />
          </div>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">Amount (KES)</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={amountInKES}
              onChange={(e) => setAmountInKES(e.target.value)}
              placeholder="Enter Amount in KES"
            />
          </div>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">IPFS Hash</label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={ipfsHash}
              readOnly
              placeholder="IPFS Hash will appear here"
            />
          </div>
          <div className="form-group mb-2">
            <label className="block text-sm font-medium text-gray-700">Upload File (Optional)</label>
            <input
              className="form-control mt-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md cursor-pointer"
              type="file"
              onChange={handleFileChange}
            />
          </div>
          <div className="form-group flex justify-center">
            <button
              className="btn bg-customBlue w-60 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              type="submit"
              disabled={!!setTxBeingSent}
            >
              Submit Claim
            </button>
          </div>
        </form>

        {transactionError && <p className="error">{transactionError}</p>}
        {setTxBeingSent && <p>Transaction sent: {setTxBeingSent}</p>}
      </div>
    </Slide>
  );
}

export default SubmitClaim;
