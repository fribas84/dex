// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma abicoder v2;

import "./Wallet.sol";

contract Dex is Wallet {

  enum Side {
    BUY,
    SELL
  }
  struct Order {
    uint id;
    address trader;
    bool buyOrder;
    Side side;
    bytes32 ticker;
    uint amount;
    uint price;

  }

  mapping(bytes32 => mapping(uint => Order[])) public orderBook;

  constructor() public {
  }

  function getOrderBook(bytes32 ticker, Side side) view public returns(Order[] memory) {
      return orderBook[ticker][uint(side)];
  }


  // function createLimitOrder(){

  // }
}
