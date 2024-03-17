// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC677Receiver} from "./shared/interfaces/IERC677Receiver.sol";
contract MockLinkToken {
    uint256 private constant TOTAL_SUPPLY = 1_000_000_000 * 1e18;
    string private constant NAME = "ChainLink Token";
    string private constant SYMBOL = "LINK";
    uint8 private constant DECIMALS = 18;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    constructor() {
        balances[msg.sender] = TOTAL_SUPPLY;
    }

    function totalSupply() external pure returns (uint256) {
        return TOTAL_SUPPLY;
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balances[msg.sender] >= _value, "Insufficient balance");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        return true;
    }

    function transferAndCall(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) external returns (bool success) {
        transfer(_to, _value);
        if (isContract(_to)) {
            contractFallback(_to, _value, _data);
        }
        return true;
    }

    function balanceOf(address _owner) external view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(
        address _spender,
        uint256 _value
    ) external returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        return true;
    }

    function allowance(
        address _owner,
        address _spender
    ) external view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function decreaseApproval(
        address _spender,
        uint256 _subtractedValue
    ) external returns (bool success) {
        uint256 oldValue = allowed[msg.sender][_spender];
        if (_subtractedValue >= oldValue) {
            allowed[msg.sender][_spender] = 0;
        } else {
            allowed[msg.sender][_spender] = oldValue - _subtractedValue;
        }
        return true;
    }

    function increaseApproval(address _spender, uint256 _addedValue) external {
        allowed[msg.sender][_spender] += _addedValue;
    }

    function name() external pure returns (string memory tokenName) {
        return NAME;
    }

    function symbol() external pure returns (string memory tokenSymbol) {
        return SYMBOL;
    }

    function decimals() external pure returns (uint8 decimalPlaces) {
        return DECIMALS;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success) {
        require(balances[_from] >= _value, "Insufficient balance");
        require(allowed[_from][msg.sender] >= _value, "Insufficient allowance");

        balances[_from] -= _value;
        balances[_to] += _value;
        allowed[_from][msg.sender] -= _value;
        return true;
    }

    // Helper functions
    function isContract(address _addr) private view returns (bool hasCode) {
        uint256 length;
        assembly {
            length := extcodesize(_addr)
        }
        return length > 0;
    }

    function contractFallback(
        address _to,
        uint256 _value,
        bytes calldata _data
    ) private {
        IERC677Receiver receiver = IERC677Receiver(_to);
        receiver.onTokenTransfer(msg.sender, _value, _data);
    }
}
