// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface ZimToken {
    function decimals() external view returns (uint8);
    function balanceOf(address _address) external view returns (uint256);
    function transfer(address _to, uint256 _value) external returns (bool success);
}

contract TokenSale {
    address owner;
    uint256 price;
    ZimToken zimTokenContract;
    uint256 tokensSold;

    event Sold(address _buyer, uint256 _amount);

    constructor(uint256 _price, address _addressContract) {
        owner = msg.sender;
        price = _price;
        zimTokenContract = ZimToken(_addressContract);
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        require(c / a == b);
        return c;
    }

    function buy(uint256 _numTokens) public payable {
        require(msg.value == mul(price, _numTokens));
        uint256 scaledAmount = mul(_numTokens, uint256(10) ** zimTokenContract.decimals());
        require(zimTokenContract.balanceOf(address(this)) >= scaledAmount);
        tokensSold += _numTokens;
        require(zimTokenContract.transfer(msg.sender, scaledAmount));
        emit Sold(msg.sender, _numTokens);
    }

    function endSold() public {
        require(msg.sender == owner);
        require(zimTokenContract.transfer(owner, zimTokenContract.balanceOf(address(this))));
        payable(msg.sender).transfer(address(this).balance);
    }
}
