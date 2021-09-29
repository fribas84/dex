const Token = artifacts.require("Token");
const Dex = artifacts.require("Dex");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Token);
  let dex = await Dex.deployed();
  let token = await Token.deployed();

  await dex.addToken(web3.utils.fromUtf8(token.symbol()),token.address);
  await token.approve(dex.address,1000);
  await dex.deposit(100, web3.utils.fromUtf8(token.symbol));
  let balanceOfToken = await dex.balances(accounts[0], web3.utils.fromUtf8(token.symbol));

  console.log(balanceOfToken);

};
