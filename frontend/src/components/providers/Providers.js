import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import NHIF from '../../contracts/Token.json';


const contractAddress = '0x95c2Ea24993E2903BDbe3239399D22Ab3Ac4e5DB';

export function Providers({ provider, selectedAddress, setTransactionError, setTxBeingSent }) {
  const [nhifContract, setNHIFContract] = useState(null);

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
  }, [provider, setTransactionError]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <nav className="bg-customBlue text-white py-4 shadow-md">
          <div className="container mx-auto flex justify-between">
            <Link to="/providers" className="text-2xl font-bold">
              NHIF Providers
            </Link>
            <div className="row">
            <div className="col-12">
              <h1>NHIF Management System</h1>
              <p>Welcome <b>{selectedAddress}</b></p>
            </div>
          </div>
            <ul className="flex space-x-4">
              <li>
                <Link to="/providers/register" className="hover:text-gray-200">
                  Register provider
                </Link>
              </li>
              <li>
                <Link to="/providers/actions" className="hover:text-gray-200">
               Provider Actions
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        
      </div>
    </Router>
  );
}
export default Providers