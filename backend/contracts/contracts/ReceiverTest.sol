//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;  

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

contract CCIPReceiverContract is CCIPReceiver {
    string public latestMessageText;
    address public latestMessageSender;

    constructor(address _router) CCIPReceiver(_router) {    }

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        latestMessageText = abi.decode(message.data, (string));
        latestMessageSender = abi.decode(message.sender, (address));
    }
    
} 