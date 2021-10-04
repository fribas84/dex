const Dex = artifacts.require("Dex");
const Token = artifacts.require("Token");
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("Dex", accounts => {
  it("Validate if Dex contract is deployed correctly", async function () {
    await Dex.deployed();
    return assert.isTrue(true);
  });

  it("Only owners shold add token", async function () {
    let dex = await Dex.deployed();
    let token = await Token.deployed();
  
    await truffleAssert.passes(
      dex.addToken(web3.utils.fromUtf8(token.symbol()),token.address,
                      {from:accounts[0]}));
    
    await truffleAssert.reverts(
      dex.addToken(web3.utils.fromUtf8(token.symbol()),token.address,
                      {from:accounts[1]}));

  })

  it("Should handle deposits correctly", async function (){
     let dex = await Dex.deployed();
     let token = await Token.deployed();
     await token.approve(dex.address,1000,{from:accounts[0]});
     await dex.deposit(100, web3.utils.fromUtf8(token.symbol),
                      {from:accounts[0]});
     let balance = await dex.balances(accounts[0],
                                      web3.utils.fromUtf8(token.symbol));
     assert.equal(balance.toNumber(),100)
     await console.log("Balance of accout" + balance.toNumber())
      
   })

   it("Should handle faulty withdraws correctly", async function (){
    let dex = await Dex.deployed();
    let token = await Token.deployed();

    await truffleAssert.reverts(dex.withdraw(500, web3.utils.fromUtf8(token.symbol)))
   })

   it("Should handle withdraws correctly", async function (){
    let dex = await Dex.deployed();
    let token = await Token.deployed();

    await truffleAssert.passes(dex.withdraw(100, web3.utils.fromUtf8(token.symbol)))
   })
});
