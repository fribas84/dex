const Dex = artifacts.require("Dex");
const Token = artifacts.require("Token");
const truffleAssert = require('truffle-assertions');

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("markerOrder", accounts => {
  it("should assert true", async function () {
    let dex = await Dex.deployed();
    let token = await Token.deployed();
    return assert.isTrue(true);
  });

  //When creating a SELL market order, the seller needs to have enough tokens for the trade

  it("Send an error when token balance < SELL market error", async () => {
    let dex = await Dex.deployed();
    let token = await Token.deployed();

    let balance = await dex.balances(accounts[0],web3.utils.fromUtf8(token.symbol));
    
    console.log(balance.toNumber());
    assert.equal(balance.toNumber(),0,"Initial balance is not 0");

    await truffleAssert.reverts(
      dex.createMarketOrder(1,web3.utils.fromUtf8(token.symbol),15)
      )
    })
  
  //Market orders can be submitted even if the order book is empty
  it("Market orders can be submitted even if the order book is empty", async function (){
    let dex = await Dex.deployed();
    let token = await Token.deployed();
    await dex.depositEth({value:10000});
    let orderBook = await dex.getOrderBook(web3.utils.fromUtf8(token.symbol),0);
    assert(orderbook.length == 0, "Order Book is not empty");

    await truffleAssert.passes(
      dex.createMarketOrder(0,web3.utils.fromUtf8(token.symbol),5)
    )
  })

  //Market orders should be filled until the order book is empty or the market order is 100% filled

  it("MO should not filled more LO than MO amount", async () => { 
    let dex = await Dex.deployed();
    let token = await Token.deployed();

    //Get Sell Order Book
    let sellOrderBook = await dex.getOrderBook(web3.utils.fromUtf8(token.symbol),1);
    assert(orderbook.length == 0, "Sell Order Book length should be 0 ");

    //Transfer dummy tokens from account 0 to other accounts
    await token.transfer(accounts[1], 100);
    await token.transfer(accounts[2], 100);
    await token.transfer(accounts[3], 100);

    //Aprove token to deposit to dex
    await token.approve(accounts[1], 100);
    await token.approve(accounts[2], 100);
    await token.approve(accounts[3], 100);

    //deposit dummy token to dex to have balance to create sell limit orders

    await dex.deposit(50, web3.utils.fromUtf8(token.symbol), {from: accounts[1]});
    await dex.deposit(50, web3.utils.fromUtf8(token.symbol), {from: accounts[2]});
    await dex.deposit(50, web3.utils.fromUtf8(token.symbol), {from: accounts[3]});
    
    //create Sell LO for dummy token

    await dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol), 5, 10, {from: accounts[1]})
    await dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol), 5, 20, {from: accounts[2]})
    await dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol), 5, 30, {from: accounts[3]})
    
    
    //create buy MO to fill 2/3 of LO from account [0]
    dex.createMarketOrder(0,web3.utils.fromUtf8(token.symbol),10);

    sellOrderBook = await dex.getOrderBook(web3.utils.fromUtf8(token.symbol),1);

    assert(sellOrderBook.length == 1, "Sell Orderbook must have 1 order left.");
    assert(sellOrderBook[0].filled ==0,"The remaining Sell Order but be 0% filled."); 
      
  })
  
  //The eth balance of the buyer should decrease with the filled amount

  it("The balance of buyer should decrease the same that filled amount", async () => {
    
    let dex = await Dex.deployed();
    let token = await Token.deployed();

    //Create a sell order so an account can fill
    await link.approve(dex.address, 200, {from: accounts[1]});
    await dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol), 1, 200, {from: accounts[1]})

    let balanceBefore = await dex.balances(accounts[0], web3.utils.fromUtf8("ETH"));

    //create market order to fill previous limit order. 
    await dex.createMarketOrder(0, web3.utils.fromUtf8(token.symbol), 1);
    let balanceAfter = await dex.balances(accounts[0], web3.utils.fromUtf8("ETH"));

    //Validate the balance
    assert.equal(balanceBefore.toNumber() - 200,
                 balanceAfter.toNumber());
  })

  //The token balances of the limit order sellers should decrease with the filled amounts.

  
  //Filled limit orders should be removed from the orderbook

  //Partly filled limit orders should be modified to represent the filled/remaining amount

  //When creating a BUY market order, the buyer needs to have enough ETH for the trade

});
