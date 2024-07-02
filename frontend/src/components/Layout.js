import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Dapp } from './Dapp';
// import { Loading } from './Loading';

const Layout = ({ connectMetaMask, children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            {/* <Loading/> */}

            <Dapp/>
            <Footer />
        </div>
    );
};

export default Layout;