import React from 'react';

const Header = ({ connectMetaMask, address, network, balance }) => {
    return (
        <header className="bg-gray-900 text-white py-4 px-8 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Blockchain Health Insurance</h1>
            </div>
            <div className="flex items-center space-x-4">
                {address && (
                    <div className="text-sm">
                        <p>Address: {address}</p>
                        <p>Network: {network}</p>
                        <p>Balance: {balance} ETH</p>
                    </div>
                )}
                
            </div>
        </header>
    );
};

export default Header;