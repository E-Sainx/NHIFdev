// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // Set the monthly contribution amount (in wei)
  const monthlyContributionWei = hre.ethers.utils.parseEther("0.01"); // Example: 0.01 ETH

  // Deploy the SHA contract
  const NHIF = await hre.ethers.getContractFactory("SHA");
  const nhif = await NHIF.deploy(monthlyContributionWei);

  // Wait for the contract to be deployed
  await nhif.deployed();
  console.log("SHA deployed to:", nhif.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
