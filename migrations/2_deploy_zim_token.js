const ZimToken = artifacts.require("ZimToken");
const TokenSale = artifacts.require("TokenSale");

module.exports = async function (deployer) {
  await deployer.deploy(ZimToken);
  const instance = await ZimToken.deployed();
  await deployer.deploy(TokenSale, 10, instance.address);
};