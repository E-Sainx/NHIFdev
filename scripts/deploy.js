// scripts/deploy.js
const hre = require('hardhat');
const { uploadToIPFS } = require('./upload-to-ipfs');

async function main() {
  // Content to be uploaded to IPFS
  const content = 'This is a sample content to upload to IPFS.';

  // Upload the content to IPFS and get the hash
  const ipfsHash = await uploadToIPFS(content);
  console.log(`Uploaded content to IPFS with hash: ${ipfsHash}`);

  // Set the monthly contribution amount (in wei)
  const monthlyContributionWei = hre.ethers.utils.parseEther('0.01'); // Example: 0.1 ETH

  // Deploy the contract and pass the IPFS hash
  const NHIF = await hre.ethers.getContractFactory('NHIF');
  const nhif = await NHIF.deploy(monthlyContributionWei);

  await nhif.deployed();
  console.log('NHIF deployed to:', nhif.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
