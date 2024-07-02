# Blockchain Health Insurance

This project demonstrates a blockchain-based health insurance system using Hardhat, Solidity, React, and MetaMask. It aims to provide a decentralized solution for managing health insurance, including member registration, provider registration, claim submission, and claim approval.

## Project Overview

The Blockchain Health Insurance system includes the following components:
- **Smart Contracts**: Written in Solidity and deployed using Hardhat.
- **Frontend**: Built with React, styled using Tailwind CSS, and integrated with MetaMask for blockchain interactions.
- **MetaMask Integration**: Enables users to connect their MetaMask wallet for authentication and transactions on the blockchain.

## Features

- **Member Registration**: Allows users to register as NHIF members.
- **Provider Registration**: Allows healthcare providers to register with the system.
- **Member Login**: Enables NHIF members to log in.
- **Provider Login**: Enables healthcare providers to log in.
- **Claim Submission**: Allows members to submit health insurance claims.
- **Claim Approval**: Enables providers to approve submitted claims.

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites

- **Node.js**: Make sure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **MetaMask**: Install the MetaMask extension in your browser. You can download it from [here](https://metamask.io/).

### Installation

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/E-Sainx/blockchain-health-insurance.git
   cd blockchain-health-insurance
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Install Hardhat**:
   ```sh
   npm install --save-dev hardhat
   ```

### Smart Contracts

The smart contracts are written in Solidity and managed using Hardhat.

1. **Compile the Contracts**:
   ```sh
   npx hardhat compile
   ```

2. **Run Tests**:
   ```sh
   npx hardhat test
   ```

3. **Deploy Contracts**:
   ```sh
   npx hardhat node
   npx hardhat run scripts/deploy.js --network sepolia
   ```

### Frontend

The frontend is built with React and integrated with MetaMask.

1. **Start the React App**:
   ```sh
   npm start
   ```

2. **Connect MetaMask**:
   - Open MetaMask and connect to the localhost network (usually `http://localhost:8545`).
   - Import an account using the private key provided by Hardhat when running `npx hardhat node`.

### Usage

1. **Open the Application**:
   - The React application should be running at `http://localhost:3000`.

2. **Register and Login**:
   - Use the interface to register as a member or provider.
   - Log in using the registered member or provider credentials.

3. **Submit and Approve Claims**:
   - Members can submit health insurance claims.
   - Providers can approve submitted claims.

## Hardhat Tasks

You can run the following Hardhat tasks:

- **Help**:
  ```sh
  npx hardhat help
  ```

- **Run Tests**:
  ```sh
  npx hardhat test
  ```

- **Run Tests with Gas Report**:
  ```sh
  REPORT_GAS=true npx hardhat test
  ```

- **Run Local Node**:
  ```sh
  npx hardhat node
  ```

- **Deploy Contracts Using Ignition**:
  ```sh
  npx hardhat ignition deploy ./ignition/modules/Deploy.js
  ```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.

# NHIFdev
# NHIFdev
