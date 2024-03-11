//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;  

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";

contract CCIPSender {
    enum PayFeesIn {
        Native,
        LINK
    }
    
    enum ASSET_TYPE {
        ERC20,
        ERC721,
        ETH
    }

    address immutable i_router;
    address immutable i_link;

    event MessageSent(bytes32 messageId);

    event RaffleStarted(
        uint256 indexed raffleId,
        address indexed nftAddress,
        uint256 indexed nftId,
        ASSET_TYPE assetType
    );

    struct CreateRaffle {
        uint256 number;
        string text;
        address addr;
    }

    constructor(address router, address link) {
        i_router = router;
        i_link = link;
    }

    receive() external payable {}

    function send(
        uint64 destinationChainSelector,
        address receiver,
        PayFeesIn payFeesIn
    ) external {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(receiver),
            data: abi.encode("minimumFundsInWei", "priceStructureId", "deadline"),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: payFeesIn == PayFeesIn.LINK ? i_link : address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (payFeesIn == PayFeesIn.LINK) {
            LinkTokenInterface(i_link).approve(i_router, fee);
            messageId = IRouterClient(i_router).ccipSend(
                destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(
                destinationChainSelector,
                message
            );
        }

        emit MessageSent(messageId);
    }

    function encodeMyStruct(CreateRaffle memory data) public pure returns (bytes memory) {
        return abi.encode(data.number, data.text, data.addr);
    }


    
    /// @param _desiredFundsInWeis the amount the seller would like to get from the raffle
    /// @param _collateralAddress The address of the NFT of the raffle
    /// @param _collateralId The id of the NFT (ERC721)
    /// @param _minimumFundsInWeis The mininum amount required for the raffle to set a winner
    /// @param _prices Array of prices and amount of entries the customer could purchase
    //   /// @param _commissionInBasicPoints commission for the platform, in basic points
    /// @notice Creates a raffle
    /// @dev creates a raffle struct and push it to the raffles array. Some data is stored in the funding data structure
    /// sends an event when finished
    /// @return raffleId
    function createRaffle(
        address _prizeAddress,
        uint256 _prizeNumber,
        uint128 _minimumFundsInWeis,
        uint32 _priceStructureId,
        ASSET_TYPE _assetType,
        uint256 _deadlineDuration
    ) external returns (uint256) {
        require(
            _deadlineDuration <= maxDeadlineDuration,
            "Deadline exceeds maximum duration"
        );

        // Handle the transfer and ownership validation based on asset type
        handleAssetTransferAndValidation(
            _prizeAddress,
            _prizeNumber,
            _assetType
        );

        raffles.push(
            RaffleStruct({
                cancellingDate: 0,
                prizeNumber: _prizeNumber,
                prizeAddress: _prizeAddress,
                winner: address(0),
                seller: msg.sender,
                randomNumber: 0,
                assetType: _assetType,
                deadline: block.timestamp + _deadlineDuration
            })
        );

        saveEntryInfo(_entryType);

        uint256 idRaffle = raffles.length - 1;
        uint256 prizesLength = _prices.length;
        if (prizesLength == 0) revert CreateRaffleError("No prices");

        for (uint256 i = 0; i < _prices.length; ++i) {
            require(_prices[i].numEntries != 0, "numEntries is 0");

            pricesList[idRaffle].push(_prices[i]);
        }

        fundingList[idRaffle] = FundingStructure({
            minimumFundsInWeis: _minimumFundsInWeis
        });

        emit RaffleStarted(idRaffle, _prizeAddress, _prizeNumber, _assetType);

        return idRaffle;
    }

    function handleAssetTransferAndValidation(
        address _prizeAddress,
        uint256 _prizeNumber,
        ASSET_TYPE _assetType
    ) internal {
        if (_assetType == ASSET_TYPE.ERC721) {
            IERC721 prizeToken = IERC721(_prizeAddress);
            require(
                prizeToken.ownerOf(_prizeNumber) == msg.sender,
                "Not the NFT owner"
            );
            require(
                prizeToken.isApprovedForAll(msg.sender, address(this)) ||
                    prizeToken.getApproved(_prizeNumber) == address(this),
                "Contract not approved"
            );
            prizeToken.transferFrom(msg.sender, address(this), _prizeNumber);
        } else if (_assetType == ASSET_TYPE.ERC20) {
            IERC20 prizeToken = IERC20(_prizeAddress);
            require(
                prizeToken.allowance(msg.sender, address(this)) >= _prizeNumber,
                "Allowance Error"
            );
            require(
                prizeToken.transferFrom(
                    msg.sender,
                    address(this),
                    _prizeNumber
                ),
                "Transfer failed"
            );
        } else if (_assetType == ASSET_TYPE.ETH) {
            require(msg.value == _prizeNumber, "ETH prize amount mismatch");
        }
    }
} 