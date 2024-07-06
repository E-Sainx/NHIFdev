// ProviderActions.js
import React, { useState } from 'react';
import { ethers } from 'ethers';


const ProviderActions = ({ provider, nhifContract, selectedAddress }) => {
    const [nationalId, setNationalId] = useState('');
    const [amount, setAmount] = useState('');
    const [ipfsHash, setIpfsHash] = useState('');
    const [transactionError, setTransactionError] = useState(null);
    const [txBeingSent, setTxBeingSent] = useState(null);

    const submitClaim = async () => {
        try {
            const tx = await nhifContract.submitClaim(nationalId, ethers.utils.parseEther(amount), ipfsHash);
            setTxBeingSent(tx.hash);
            await tx.wait();
            alert('Claim submitted successfully');
        } catch (error) {
            setTransactionError(error);
        } finally {
            setTxBeingSent(null);
        }
    };

    return (
        <div>
            <h2>Submit Claim</h2>
            <div>
                <label>National ID:</label>
                <input type="text" value={nationalId} onChange={(e) => setNationalId(e.target.value)} />
            </div>
            <div>
                <label>Amount (ETH):</label>
                <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
                <label>IPFS Hash:</label>
                <input type="text" value={ipfsHash} onChange={(e) => setIpfsHash(e.target.value)} />
            </div>
            <button onClick={submitClaim} disabled={txBeingSent}>Submit Claim</button>
            {transactionError && <p className="error">{transactionError.message}</p>}
            {txBeingSent && <p>Transaction sent: {txBeingSent}</p>}
        </div>
    );
};

export default ProviderActions;
