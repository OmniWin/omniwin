// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract USDC is ERC20, Ownable {
    constructor() ERC20("USDC", "USDC") {}

    // Override the decimals function to return 6
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    // Function to mint tokens. Only the owner of the contract can mint tokens to prevent abuse.
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
