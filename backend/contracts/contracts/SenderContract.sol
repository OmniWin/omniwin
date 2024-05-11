// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.4;

import {IMailbox} from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import {IInterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";

contract SenderContract {
    IMailbox public outbox;
    uint32 public destinationDomainId; // Domain ID for Mumbai
    address public recipient;
    IInterchainGasPaymaster public igp;

    constructor(address _outboxAddress, uint32 _destinationDomainId) {
        outbox = IMailbox(_outboxAddress);
        destinationDomainId = _destinationDomainId;
    }

    function setRecipient(address _recipient) external {
        recipient = _recipient;
    }

    // alignment preserving cast
    function addressToBytes32(address _addr) internal pure returns (bytes32) {
        return bytes32(uint256(uint160(_addr)));
    }

    function estimateFees(
        bytes memory message
    ) external view returns (uint256) {
        // The recipient address here is assumed to be already set and is the address of your ReceiverContract on the destination chain (Mumbai)
        bytes32 recipientBytes32 = addressToBytes32(recipient);

        // Estimate the fees for dispatching the message
        uint256 fees = outbox.quoteDispatch(
            destinationDomainId,
            recipientBytes32,
            message
        );

        return fees;
    }

    function sendMessage(bytes memory message) external payable {
        // The recipient address here is the address of your ReceiverContract on the destination chain (Mumbai)
        // Ensure this is set correctly. This example just shows the structure.

        bytes32 recipientBytes32 = addressToBytes32(recipient);

        // Dispatch the message to the destination chain
        outbox.dispatch(destinationDomainId, recipientBytes32, message);
    }
}
