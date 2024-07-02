async function main() {
  const NHIF = await ethers.getContractFactory('NHIF');
  const monthlyContributionWei = 1000; // Replace with your desired value
  const nhifInstance = await NHIF.deploy(monthlyContributionWei);
  await nhifInstance.deployed();
  console.log('NHIF deployed to:', nhifInstance.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
