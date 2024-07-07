import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NHIF from '../components/contracts/Token.json';
import contractAddress from '../components/contracts/contract-address.json';
import { NoWalletDetected } from './NoWalletDetected';
import { ConnectWallet } from './ConnectWallet';
import { TransactionErrorMessage } from './TransactionErrorMessage';
import { WaitingForTransactionMessage } from './WaitingForTransactionMessage';
import { Members } from '../components/members/Members';

const HARDHAT_NETWORK_ID = '31337';
const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export function Dapp() {
  const [provider, setProvider] = useState(null);
  const [nhifContract, setNHIFContract] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [networkError, setNetworkError] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [txBeingSent, setTxBeingSent] = useState(null);

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);

        const nhifContract = new ethers.Contract(
          contractAddress.NHIF,
          NHIF.abi,
          provider.getSigner(0)
        );
        setNHIFContract(nhifContract);

        try {
          await connectWallet();
        } catch (error) {
          console.error('Failed to connect wallet:', error);
        }
      }
    };

    initialize();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', ([newAddress]) => {
        setSelectedAddress(newAddress || null);
      });
    }

  }, []);

  const connectWallet = async () => {
    try {
      const [selectedAddress] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setSelectedAddress(selectedAddress);
      checkNetwork();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const checkNetwork = () => {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID) {
      setNetworkError('Please connect to the Hardhat network');
    } else {
      setNetworkError(null);
    }
  };

  const dismissNetworkError = () => {
    setNetworkError(null);
  };

  if (window.ethereum === undefined) {
    return <NoWalletDetected />;
  }

  return (
    <div className="container p-4">
      {!selectedAddress ? (
        <ConnectWallet 
          connectWallet={connectWallet}
          networkError={networkError}
          dismiss={dismissNetworkError}
        />

      
      ) : (
       
        <>
          

          <hr />

          {txBeingSent && (
            <WaitingForTransactionMessage txHash={txBeingSent} />
          )}

          {transactionError && (
            <TransactionErrorMessage
              message={transactionError.message}
              dismiss={() => setTransactionError(null)}
            />
          )}

          <div className="row">
            <div className="col-12">
              <Members 
                provider={provider}
                nhifContract={nhifContract}
                selectedAddress={selectedAddress}
                setTransactionError={setTransactionError}
                setTxBeingSent={setTxBeingSent}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dapp;