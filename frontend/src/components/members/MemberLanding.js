import React from "react";
import { Slide, Fade } from 'react-awesome-reveal';

const MemberLanding = () => {
  return (
    <>
      {/* Additional Information and Animations */}
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <h2 className="text-3xl font-bold text-customBlue mb-4">About NHIF Management System</h2>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600">
              The NHIF Management System is designed to streamline the registration, contribution, and claim processes for NHIF members and healthcare providers. Our goal is to ensure efficient and transparent management of healthcare funds, making healthcare accessible and affordable for all members.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              As a member, you can register yourself, make monthly contributions, and submit claims for healthcare expenses. Our system ensures that all contributions and claims are handled securely and transparently.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              Here are some key features of our system:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Secure and transparent contribution management</li>
              <li>Efficient claim submission and processing</li>
              <li>Real-time updates on your contribution and claim status</li>
              <li>Automated claim approvals for eligible claims</li>
              <li>Comprehensive member and provider management</li>
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

export default MemberLanding;
