// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract OmniwinERC20 is ERC20 {
    // Define the supply of FunToken: 1,000,000
    uint256 constant initialSupply = 1000000 * (10 ** 18);

    // Constructor will be called on contract creation
    constructor() ERC20("FunToken", "FUN") {
        _mint(msg.sender, initialSupply);
    }
}
