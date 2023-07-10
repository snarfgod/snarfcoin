const hre = require("hardhat");

async function main() {
  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy('Snarfcoin', "SNARF", '1000000000000000000000000');  
  await token.deployed();

  console.log("Token deployed to:", token.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
