import React from "react";
import { Slide, Fade } from 'react-awesome-reveal';

const ProviderLanding = () => {
  return (
    <>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <h2 className="text-3xl font-bold text-customBlue mb-4">About NHIF Providers</h2>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600">
              NHIF Providers play a crucial role in the healthcare system by offering essential services to members. Our platform facilitates seamless interactions between providers and the NHIF, ensuring timely payments and efficient claim processing.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              As a provider, you can register with the NHIF, manage your profile, and submit claims for services rendered to NHIF members. The system ensures that all transactions are secure and transparent.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              Key features for providers include:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Efficient provider registration and management</li>
              <li>Secure claim submission and tracking</li>
              <li>Automated payment processing</li>
              <li>Access to detailed reports and analytics</li>
              <li>Real-time updates on claim statuses</li>
            </ul>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <h2 className="text-3xl font-bold text-customBlue mb-4">Ethereum Blockchain Integration</h2>
          <Fade>
            <p className="text-gray-600">
              The NHIF Management System leverages the power of the Ethereum blockchain to ensure security, transparency, and immutability of all transactions. By using smart contracts, we automate and streamline processes, reducing the need for manual intervention and minimizing errors.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              Here are some benefits of using the Ethereum blockchain:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Decentralized and tamper-proof record keeping</li>
              <li>Automated execution of agreements through smart contracts</li>
              <li>Enhanced security with cryptographic protocols</li>
              <li>Reduced operational costs and increased efficiency</li>
              <li>Global accessibility and transparency</li>
            </ul>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              By integrating Ethereum blockchain technology, we ensure that all transactions related to member contributions and provider claims are handled securely, transparently, and efficiently. This integration brings a new level of trust and accountability to the NHIF Management System.
            </p>
          </Fade>
        </div>
      </Slide>
    </>
  );
};

export default ProviderLanding;
