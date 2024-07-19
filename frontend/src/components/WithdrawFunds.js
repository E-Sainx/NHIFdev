import React, { useState } from "react";
import { Slide } from "react-awesome-reveal";
import { ethers } from "ethers";

export function WithdrawFunds({
  nhifContract,
  setTransactionError,
  setTxBeingSent,
}) {
  const [amountKES, setAmountKES] = useState("");
  const [exchangeRate] = useState(0.000003); // Example exchange rate: 1 KES = 0.000003 ETH
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (nhifContract) {
      try {
        // Convert amount from KES to ETH
        const amountETH = (parseFloat(amountKES) * exchangeRate).toString();
        console.log("Withdrawing funds...", amountETH);
        setTxBeingSent("Withdrawing funds...");
        const tx = await nhifContract.withdrawFunds(
          ethers.utils.parseUnits(amountETH, "ether"),
        );
        await tx.wait();
        setTxBeingSent(null);
        alert("Funds withdrawn successfully!");
        setAmountKES("");
        setError(""); // Clear error on successful transaction
      } catch (error) {
        console.error("Error withdrawing funds:", error);

        // Extract and format the error message
        let errorMessage = "Error withdrawing funds: ";
        if (error.message.includes("execution reverted:")) {
          errorMessage +=
            "Transaction failed. Please check if you have sufficient balance and try again.";
        } else if (error.message.includes("cannot estimate gas")) {
          errorMessage +=
            "Cannot estimate gas. The transaction may fail or may require a manual gas limit.";
        } else {
          errorMessage += error.message;
        }

        setError(errorMessage);
        setTxBeingSent(null);
      }
    } else {
      setError("Contract not initialized");
    }
  };

  return (
    <Slide direction="up">
      <div className="mx-auto p-4 bg-white shadow-md rounded-md">
        <h4 className="text-2xl font-bold mb-4 text-customBlue">
          Withdraw Funds
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Amount (KES)
            </label>
            <input
              className="form-control mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              type="text"
              value={amountKES}
              onChange={(e) => setAmountKES(e.target.value)}
              placeholder="Enter Amount in KES"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="btn bg-customBlue w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
              value="Withdraw Funds"
            />
          </div>
        </form>
        {error && (
          <div className="mt-4">
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-xs text-gray-500 mt-2">
              For more information, visit{" "}
              <a
                href="https://links.ethers.org/v5-errors-UNPREDICTABLE_GAS_LIMIT"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Ethers Error Documentation
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </Slide>
  );
}

export default WithdrawFunds;
