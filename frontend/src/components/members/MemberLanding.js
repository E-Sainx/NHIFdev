import React from "react";
import { Slide, Fade } from 'react-awesome-reveal';

const MemberLanding = () => {
  return (
    <>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <h2 className="text-3xl font-bold text-customBlue mb-4">About NHIF Management System</h2>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600">
              The NHIF Management System streamlines registration, contribution, and claim processes for members and healthcare providers, ensuring efficient and transparent healthcare fund management.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              Members can register, make contributions, and submit claims securely and transparently.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">Key features:</p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Secure contribution management</li>
              <li>Efficient claim processing</li>
              <li>Real-time updates</li>
              <li>Automated claim approvals</li>
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
              Leveraging Ethereum blockchain ensures security, transparency, and immutability of transactions. Smart contracts automate processes, reducing errors and manual intervention.
            </p>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">Blockchain benefits:</p>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              <li>Decentralized record keeping</li>
              <li>Automated agreements via smart contracts</li>
              <li>Enhanced security with cryptographic protocols</li>
              <li>Reduced costs and increased efficiency</li>
              <li>Global accessibility and transparency</li>
            </ul>
          </Fade>
        </div>
      </Slide>
      <Slide direction="down">
        <div className="bg-white shadow-md rounded-md p-6 mb-6 h-full">
          <Fade>
            <p className="text-gray-600 mt-4">
              Ethereum integration ensures secure, transparent, and efficient handling of member contributions and provider claims, enhancing trust and accountability.
            </p>
          </Fade>
        </div>
      </Slide>
    </>
  );
};

export default MemberLanding;
