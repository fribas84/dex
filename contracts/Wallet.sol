// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";


contract Wallet {
  using SafeMath for uint256;
  //Balance of multiple tokens
  // address to Token Symbol (ticker) to value
  mapping(address => mapping(bytes32 => uint256)) public balances;
  
  struct Token {
    bytes32 ticker;
    address tokenAddress;
  }

  bytes32[] public tokenList; // index of tokens
  mapping(bytes32 => Token) public tokenMapping;

  constructor() public {


  }

  function addToken(bytes32 ticker, address tokenAddress) external{
    tokenMapping[ticker] = Token(ticker,tokenAddress);
    tokenList.push(ticker);
    
  }

  function deposit(uint amount, bytes32 ticker) external {
   //if address == 0x000000 means that the ticker has not been add to the wallet.
    require(tokenMapping[ticker].tokenAddress !=address(0), "Token doesn't exists");
    IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
    balances[msg.sender][ticker] =balances[msg.sender][ticker].add(amount);
  }

  function withdraw(uint amount, bytes32 ticker) external {
    //if address == 0x000000 means that the ticker has not been add to the wallet.
    require(tokenMapping[ticker].tokenAddress !=address(0), "Token doesn't exists");
    require(balances[msg.sender][ticker] >= amount,"Balance not sufficient");
    //substract using safemath
    balances[msg.sender][ticker] = balances[msg.sender][ticker].sub(amount); 
    IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);
    
  }
}
