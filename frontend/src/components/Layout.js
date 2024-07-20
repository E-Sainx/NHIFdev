import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './Header';
import Footer from './Footer';
import { Dapp } from './Dapp';
import Members from './members/Members';
import Providers from './providers/Providers';
import Admin from './admin/Admin';
import NHIFArtifact from './contracts/Token.json';
import contractAddress from './contracts/contract-address.json';
import { ConnectWallet } from './ConnectWallet';
import { toast } from 'react-toastify';
import { Loading } from './Loading';

const Layout = () => {
    const [currentView, setCurrentView] = useState('dapp');
    const [provider, setProvider] = useState(null);
    const [nhifContract, setNHIFContract] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [transactionError, setTransactionError] = useState(null);
    const [txBeingSent, setTxBeingSent] = useState(null);
    const [networkError, setNetworkError] = useState(null);

    useEffect(() => {
        const initialize = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                const nhifContract = new ethers.Contract(
                    contractAddress.NHIF,
                    NHIFArtifact.abi,
                    provider.getSigner(0)
                );
                setNHIFContract(nhifContract);

                try {
                    await connectWallet();
                } catch (error) {
                    console.error('Failed to connect wallet:', error);
                }
            } else {
                console.error('Please install MetaMask!');
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
            setNetworkError(null);
        } catch (error) {
            console.error('Failed to connect wallet:', error);
            setNetworkError('Failed to connect wallet. Please try again.');
        }
    };

    const dismissNetworkError = () => {
        setNetworkError(null);
    };

    const renderContent = () => {
        if (!selectedAddress) {
            return (
                <ConnectWallet
                    connectWallet={connectWallet}
                    networkError={networkError}
                    dismiss={dismissNetworkError}
                />
            );
        }

        switch (currentView) {
            case 'members':
                return (
                    <Members
                        provider={provider}
                        nhifContract={nhifContract}
                        selectedAddress={selectedAddress}
                        setTransactionError={setTransactionError}
                        setTxBeingSent={setTxBeingSent}
                    />
                );
            case 'providers':
                return (
                    <Providers
                        provider={provider}
                        nhifContract={nhifContract}
                        selectedAddress={selectedAddress}
                        setTransactionError={setTransactionError}
                        setTxBeingSent={setTxBeingSent}
                    />
                );
            case 'admin':
                return (
                    <Admin
                        provider={provider}
                        nhifContract={nhifContract}
                        selectedAddress={selectedAddress}
                        setTransactionError={setTransactionError}
                        setTxBeingSent={setTxBeingSent}
                    />
                );
            default:
                return <Dapp />;
        }
    };

    useEffect(() => {
        if (transactionError) {
            toast.error(transactionError);
            setTransactionError(null);
        }
    }, [transactionError]);

    useEffect(() => {
        if (txBeingSent) {
            toast.info(`Transaction sent: ${txBeingSent}`);
            setTxBeingSent(null);
        }
    }, [txBeingSent]);

    return (
        <div className="max-h-screen flex flex-col">
            <Header address={selectedAddress} onNavigate={setCurrentView} />
            <main className="flex-grow">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
