import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Header from './Header';
import Footer from './Footer';
import { Dapp } from './Dapp';
import { Members } from '../components/members/Members';
import Providers from '../components/providers/Providers';
import Admin from '../components/admin/Admin'; // Assuming you have an Admin component
import NHIFArtifact from '../contracts/Token.json';
import contractAddress from '../contracts/contract-address.json';

const Layout = () => {
    const [currentView, setCurrentView] = useState('dapp');
    const [provider, setProvider] = useState(null);
    const [nhifContract, setNHIFContract] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [transactionError, setTransactionError] = useState(null);
    const [txBeingSent, setTxBeingSent] = useState(null);

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
        } catch (error) {
            console.error('Failed to connect wallet:', error);
        }
    };

    const renderContent = () => {
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
                return <Providers
                provider={provider}
                nhifContract={nhifContract}
                selectedAddress={selectedAddress}
                setTransactionError={setTransactionError}
                setTxBeingSent={setTxBeingSent}
            />
            ;
            case 'admin':
                return <Admin 
            
                />;
            default:
                return <Dapp />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header onNavigate={setCurrentView} />
            <main className="flex-grow">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
