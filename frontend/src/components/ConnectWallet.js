import React from "react";
import { NetworkErrorMessage } from "./NetworkErrorMessage";
import { Fade, Slide } from "react-awesome-reveal";
import { FaWallet, FaInfoCircle } from "react-icons/fa";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      {networkError && (
        <div className="w-full max-w-lg mb-4">
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        </div>
      )}
      <div className="max-w-lg bg-white shadow-md rounded-lg p-6">
        <div className="text-center mb-6">
          <Slide direction="down">
            <h1 className="text-4xl font-bold text-customBlue mb-2">
              Welcome to NHIF BlockChain Insurance System
            </h1>
          </Slide>
          <Fade>
            <p className="text-gray-600">
              Manage your healthcare contributions, claims, and HealthCareproviders seamlessly.
            </p>
          </Fade>
        </div>
        <div className="text-center mb-6">
          <FaWallet size={48} className="mx-auto text-customBlue mb-4" />
          <Fade delay={200}>
            <p className="text-xl font-semibold">Please connect to your wallet to get started.</p>
          </Fade>
        </div>
        <div className="text-center">
          <Fade delay={300}>
            <button
              className="btn bg-customBlue btn-warning text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="button"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          </Fade>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Slide direction="up">
          <FaInfoCircle size={32} className="text-customBlue mb-2" />
          <p className="text-gray-600">
            <strong>About the Project:</strong> This system allows members to register, make contributions, and submit claims effortlessly. Healthcare providers can manage their services and interact with members, ensuring smooth and transparent operations Using Ethereum Blockchain.
          </p>
        </Slide>
      </div>
    </div>
  );
}
