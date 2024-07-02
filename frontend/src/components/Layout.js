import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Dapp } from './Dapp';

const Layout = ({ connectMetaMask, children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header connectMetaMask={connectMetaMask} />
            <Dapp/>
            <Footer />
        </div>
    );
};

export default Layout;