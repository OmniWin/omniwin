// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";

contract ReceiverContract is IMessageRecipient {
    event MessageReceived(string message);

    function handle(
        uint32 origin,
        bytes32 sender,
        bytes calldata message
    ) external payable override {
        // Ensure the message is coming from the expected Outbox (optional)
        // require(msg.sender == expectedOutboxAddress, "Invalid sender");

        // Process the message
        // This example assumes the message can be directly converted to a string
        // You might need to decode the message differently depending on your use case
        emit MessageReceived(string(message));
    }
}
