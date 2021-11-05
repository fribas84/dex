// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma abicoder v2;

import "./Wallet.sol";

contract Dex is Wallet {
  using SafeMath for uint256;
  enum Side {
    BUY,
    SELL
  }
  struct Order {
    uint id;
    address trader;
    Side side;
    bytes32 ticker;
    uint amount;
    uint price;

  }

  uint public nextOrderId = 0;
  mapping(bytes32 => mapping(uint => Order[])) public orderBook;

  constructor() public {
  }

  function getOrderBook(bytes32 ticker, Side side) view public returns(Order[] memory) {
      return orderBook[ticker][uint(side)];
  }


  function createLimitOrder(Side side, bytes32 ticker, uint amount, uint price) public{
    if(side == Side.BUY){
      require(balances[msg.sender]["ETH"] >= amount.mul(price), "Not enough ETH");
    }
    else  if(side == Side.SELL){
      require(balances[msg.sender]["ETH"] >= amount, "Not enough ETH to sell");
    }
    //Make a reference to an orderbook that is stored in the contract.
    Order[] storage orders = orderBook[ticker][uint(side)];
    //the id must be  unique for all orders, using nextOrderId as a register.
    orders.push(
      Order(nextOrderId,msg.sender, side,ticker,amount,price)
    );

    // bubble sort depending in the order type.
    // It only needs to be sorted each time a new order is added.
    // Only one iteration needed.

    if(side == Side.BUY) {
      // Set the value if the i index, if the orders.length > 0

      uint i =  orders.length > 0 ? orders.length - 1 : 0;
      while(i>0) {
        if(orders[i].price > orders[i - 1].price){
          Order memory tempOrder = orders[i - 1];
          orders[i-1] = orders[1];
          orders[i]= tempOrder;  
        }
      i--;
      }

    }
    else if(side == Side.SELL) {

      uint i =  orders.length > 0 ? orders.length - 1 : 0;
      while(i>0) {
        if(orders[i].price < orders[i - 1].price){
          Order memory tempOrder = orders[i - 1];
          orders[i-1] = orders[1];
          orders[i]= tempOrder;  
        }
      i--;
      }

    }
    nextOrderId++;
  }

  function createMarketOrder(Side side, bytes32 ticker, uint amount) public{
    
  }
}
