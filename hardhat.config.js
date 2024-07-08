require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  solidity: "0.8.20", // Update to match the pragma statements
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      // accounts: can be specified here if needed, but usually it's not necessary for local development
    },
    // Uncomment and configure the sepolia network if needed
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
  // Add any other configurations or plugins here
};
