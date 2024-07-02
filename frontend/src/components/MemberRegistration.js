import React, { useState } from 'react';

export function MemberRegistration({ nhifContract, setTransactionError, setTxBeingSent }) {
  const [nationalId, setNationalId] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        console.log("Registering member...", nationalId, name);
        setTxBeingSent("Registering member...");
        const tx = await nhifContract.registerMember(nationalId, name);
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Transaction confirmed");
        setTxBeingSent(null);
        alert("Member registered successfully!");
        setNationalId('');
        setName('');
      } catch (error) {
        console.error("Error registering member:", error);
        setTransactionError("Error registering member: " + error.message);
        setTxBeingSent(null);
      }
    } else {
      console.error("Contract not initialized");
      setTransactionError("Contract not initialized");
    }
  };

  return (
    <div>
      <h4>Member Registration</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>National ID</label>
          <input
            className="form-control"
            type="text"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
            placeholder="Enter National ID"
            required
          />
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            required
          />
        </div>
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Register Member" />
        </div>
      </form>
    </div>
  );
}