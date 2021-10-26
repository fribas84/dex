// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Wallet is Ownable {
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


  modifier tokenExist(bytes32 ticker){
     //if address == 0x000000 means that the ticker has not been add to the wallet.
    require(tokenMapping[ticker].tokenAddress !=address(0), "Token doesn't exists");
    _;
  }
  constructor() public {


  }

  function addToken(bytes32 ticker, address tokenAddress) onlyOwner external{
    tokenMapping[ticker] = Token(ticker,tokenAddress);
    tokenList.push(ticker);
    
  }

  // require the allowance origin
  function deposit(uint amount, bytes32 ticker) tokenExist(ticker) external {
    IERC20(tokenMapping[ticker].tokenAddress).transferFrom(msg.sender, address(this), amount);
    balances[msg.sender][ticker] =balances[msg.sender][ticker].add(amount);
  }

  function withdraw(uint amount, bytes32 ticker) tokenExist(ticker) external {
           require(balances[msg.sender][ticker] >= amount,"Balance not sufficient");
    //substract using safemath
    balances[msg.sender][ticker] = balances[msg.sender][ticker].sub(amount); 
    IERC20(tokenMapping[ticker].tokenAddress).transfer(msg.sender, amount);
    
  }
  function depositEth() payable external {
        balances[msg.sender][bytes32("ETH")] = balances[msg.sender][bytes32("ETH")].add(msg.value);
    }
}
