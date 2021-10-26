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

   it("The User must have deposited ETH >= buy order value", async function() {
    let dex = await Dex.deployed();
    let token = await Token.deployed();    
    //createLimitOrder(SIDE,TOKEN,price, amount)


    await truffleAssert.reverts(
      dex.createLimitOrder(0,web3.utils.fromUtf8(token.symbol),1,10)
    )
    await token.approve(dex.address,10);

    await dex.depositEth({value: 100});

    await truffleAssert.passes(
      dex.createLimitOrder(0,web3.utils.fromUtf8(token.symbol),1,10)
    )

   })

   it("The User must have enough tokens such that Token balance >= sell order", async function() {
    let dex = await Dex.deployed();
    let token = await Token.deployed();
    
    await truffleAssert.reverts(
      dex.createLimitOrder(0,web3.utils.fromUtf8(token.symbol),1,1000000000)

    )

    await token.approve(dex.address,10);
    await dex.deposit(10, web3.utils.fromUtf8(token.symbol));
    await truffleAssert.passes(
      dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol),1,5)
    )
    
    

   })

   it("The first BUY order ([0]) in by order book should have the highest price", async function() {
    let dex = await Dex.deployed();
    let token = await Token.deployed();
    
    await token.approve(dex.address,80);
    await dex.deposit(50, web3.utils.fromUtf8(token.symbol)
                      );
    await dex.createLimitOrder(0, web3.utils.fromUtf8(token.symbol),1,20
                              );
    await dex.createLimitOrder(0, web3.utils.fromUtf8(token.symbol),1,40
                              );
    await dex.createLimitOrder(0, web3.utils.fromUtf8(token.symbol),1,50
                              );
    //getOrderBook(TOKEN,SIDE)
    let orderBook = await dex.getOrderBook(web3.utils.fromUtf8(token.symbol),0);
    console.log(orderBook);
    assert(orderBook.length >0);
    
    for(let i=0;i<orderBook.length -1;i++){

      assert(
        orderBook[i] >= orderBook[i+1], "Orderbook is in the wrong order." 
        )

      } 
  })

  it("The first SELL order ([0]) in by order book should have the lowest price", async function() {
    let dex = await Dex.deployed();
    let token = await Token.deployed();
    
    await token.approve(dex.address,100);
    await dex.deposit(80, web3.utils.fromUtf8(token.symbol)
                      );
    await dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol),1,15);
    await dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol),1,30);
    await dex.createLimitOrder(1, web3.utils.fromUtf8(token.symbol),1,2);
    let orderBook = await dex.getOrderBook(web3.utils.fromUtf8(token.symbol),1);
    console.log(orderBook);
    assert(orderBook.length >0);
    for(let i=0;i<orderBook.length -1;i++){
      assert(
        orderBook[i] <= orderBook[i+1], "Orderbook is in the wrong order." 
      )

    }

    
  })



});
