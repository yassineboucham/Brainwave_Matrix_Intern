// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy(["Alice", "Bob", "Charlie"]); // Initial candidates
  await voting.deployed();

  console.log(`✅ Contract deployed to: ${voting.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
