const hre = require("hardhat");

async function main() {
  const SharedWallet = await hre.ethers.getContractFactory("SharedWallet");
  const sharedWallet = await SharedWallet.deploy("Hello, Hardhat!");

  await sharedWallet.deployed();

  console.log("SharedWallet deployed to:", sharedWallet.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
