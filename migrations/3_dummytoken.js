const Token = artifacts.require("Token");
const Wallet = artifacts.require("Wallet");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Token);
  let wallet = await Wallet.deployed();
  let token = await Token.deployed();

  await wallet.addToken(web3.utils.fromUtf8(token.symbol()),token.address);
  await token.approve(wallet.address,1000);
  await wallet.deposit(100, web3.utils.fromUtf8(token.symbol));
  let balanceOfToken = await wallet.balances(accounts[0], web3.utils.fromUtf8(token.symbol));

  console.log(balanceOfToken);

};
