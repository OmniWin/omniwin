//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";

contract SideChainRaffle is AccessControl, CCIPReceiver {
    enum PayFeesIn {
        Native,
        LINK
    }

    enum ASSET_TYPE {
        ERC20,
        ERC721,
        ETH
    }

    error CreateRaffleError(string errorType);
    error EntryNotAllowed(string errorType);

    address immutable router;
    address immutable link;

    address public usdcContractAddress;

    uint256 maxDeadlineDuration = 30 days;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR");

    event MessageSent(bytes32 messageId);

    event RaffleCreated(
        uint256 indexed raffleId,
        address indexed nftAddress,
        uint256 indexed nftId,
        ASSET_TYPE assetType
    );

    event CreateRaffleCCIPEvent(
        bytes32 messageId,
        uint64 destinationChainSelector,
        address receiver,
        PayFeesIn payFeesIn,
        uint256 minimumFundsInWei,
        uint256 deadline
    );

    event EntrySold(
        uint256 indexed raffleId,
        address indexed buyer,
        uint256 currentSize,
        uint256 priceStructureId
    );

    struct EntryInfoStruct {
        uint48 entriesLength; // to easy frontend, the length of the entries array is saved here
        uint256 amountRaised; // funds raised so far in wei
    }

    // Every raffle has a funding structure.
    struct FundingStructure {
        uint128 minimumFundsInWeis;
    }
    mapping(uint256 => FundingStructure) public fundingList;
    mapping(uint256 => EntryInfoStruct) public rafflesEntryInfo;

    // In order to calculate the winner, in this struct is saved for each bought the data
    struct EntriesBought {
        uint48 currentEntriesLength; // current amount of entries bought in the raffle
        address player; // wallet address of the player
        uint48 priceStructureId; // id of the price structure
    }
    // every raffle has a sorted array of EntriesBought. Each element is created when calling
    // either buyEntry
    mapping(uint256 => EntriesBought[]) public entriesList;

    struct CreateRaffle {
        uint256 number;
        string text;
        address addr;
    }

    struct PriceStructure {
        uint48 numEntries;
        uint256 price;
    }

    mapping(uint256 => PriceStructure[]) public pricesList;

    // Main raffle data struct
    struct RaffleStruct {
        uint256 prizeNumber; // number (can be a percentage, an id, an amount, etc. depending on the competition)
        address prizeAddress; // address of the prize
        address winner; // address of thed winner of the raffle. Address(0) if no winner yet
        address seller; // address of the seller of the NFT
        ASSET_TYPE assetType; // type of the asset. Can be ERC20, ERC721, ETH
    }

    mapping(uint256 => RaffleStruct) public raffles;

    mapping(bytes32 => RaffleStruct) public tempRaffles;

    constructor(address _router, address _link) CCIPReceiver(_router) {
        router = _router;
        link = _link;

        _setupRole(OPERATOR_ROLE, msg.sender);
    }

    receive() external payable {}

    function CreateRaffleCCIP(
        uint64 _destinationChainSelector,
        address _receiver,
        PayFeesIn _payFeesIn,
        address _prizeAddress,
        uint256 _prizeNumber,
        ASSET_TYPE _assetType,
        uint128 _minimumFundsInWei,
        PriceStructure[] calldata _prices,
        uint256 _deadlineDuration
    ) external {
        require(
            _deadlineDuration <= maxDeadlineDuration,
            "Deadline exceeds maximum duration"
        );

        uint256 prizesLength = _prices.length;
        if (prizesLength == 0) revert CreateRaffleError("No prices");

        for (uint256 i = 0; i < _prices.length; ++i) {
            require(_prices[i].numEntries != 0, "numEntries is 0");
        }

        // Handle the transfer and ownership validation based on asset type
        handleAssetTransferAndValidation(
            _prizeAddress,
            _prizeNumber,
            _assetType
        );

        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(_receiver),
            data: abi.encode(
                _minimumFundsInWei,
                _prices,
                _deadlineDuration,
                msg.sender,
                _prizeAddress,
                _prizeNumber,
                _assetType
            ),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: _payFeesIn == PayFeesIn.LINK ? link : address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            _destinationChainSelector,
            message
        );

        bytes32 messageId;

        if (_payFeesIn == PayFeesIn.LINK) {
            LinkTokenInterface(link).approve(i_router, fee);
            messageId = IRouterClient(i_router).ccipSend(
                _destinationChainSelector,
                message
            );
        } else {
            messageId = IRouterClient(i_router).ccipSend{value: fee}(
                _destinationChainSelector,
                message
            );
        }

        tempRaffles[messageId] = RaffleStruct({
            prizeNumber: _prizeNumber,
            prizeAddress: _prizeAddress,
            winner: address(0),
            seller: msg.sender,
            assetType: _assetType
        });

        emit CreateRaffleCCIPEvent(
            messageId,
            _destinationChainSelector,
            _receiver,
            _payFeesIn,
            _minimumFundsInWei,
            _deadlineDuration
        );
    }

    function encodeMyStruct(
        CreateRaffle memory data
    ) public pure returns (bytes memory) {
        return abi.encode(data.number, data.text, data.addr);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bytes32 messageIdSourceChain, uint256 raffleId) = abi.decode(
            message.data,
            (bytes32, uint256)
        );

        RaffleStruct memory tempRaffle = tempRaffles[messageIdSourceChain];

        raffles[raffleId] = tempRaffle;

        saveEntryInfo(raffleId);

        fundingList[raffleId] = FundingStructure({minimumFundsInWeis: 0});

        emit RaffleCreated(
            raffleId,
            tempRaffle.prizeAddress,
            tempRaffle.prizeNumber,
            tempRaffle.assetType
        );
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

    function saveEntryInfo(uint256 raffleId) internal {
        EntryInfoStruct memory entryInfo = EntryInfoStruct({
            amountRaised: 0,
            entriesLength: 0
        });
        rafflesEntryInfo[raffleId] = entryInfo;
    }

    function buyEntry(
        uint256 _raffleId,
        uint48 _id,
        uint256 _usdcAmount
    ) external payable {
        if (tx.origin != msg.sender)
            revert EntryNotAllowed("No contracts allowed");
        EntryInfoStruct storage entryInfo = rafflesEntryInfo[_raffleId];

        //_raffleId must exist in raffles[raffleId]
        require(
            raffles[_raffleId].prizeAddress != address(0),
            "Raffle not found"
        );

        // do not allow to buy entries if the deadline has passed

        // Price checks
        PriceStructure memory priceStruct = pricesList[_raffleId][_id];

        require(_usdcAmount == priceStruct.price, "Incorrect USDC amount");

        // // Ensure the contract is allowed to transfer the specified amount of USDC on behalf of the sender
        IERC20 usdc = IERC20(usdcContractAddress);

        require(
            usdc.allowance(msg.sender, address(this)) >= _usdcAmount,
            "USDC allowance too low"
        );
        require(
            usdc.transferFrom(msg.sender, address(this), _usdcAmount),
            "USDC transfer failed"
        );

        uint48 numEntries = priceStruct.numEntries;

        // save the entries onchain
        uint48 entriesLength = entryInfo.entriesLength;
        EntriesBought memory entryBought = EntriesBought({
            player: msg.sender,
            currentEntriesLength: uint48(entriesLength + numEntries),
            priceStructureId: _id
        });
        entriesList[_raffleId].push(entryBought);

        // update raffle variables
        entryInfo.amountRaised += _usdcAmount;
        entryInfo.entriesLength += numEntries;

        emit EntrySold(_raffleId, msg.sender, entryInfo.entriesLength, _id);
    }

    function setUSDCTokenAddress(
        address _usdcContractAddress
    ) external onlyRole(OPERATOR_ROLE) {
        usdcContractAddress = _usdcContractAddress;
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, CCIPReceiver) returns (bool) {
        return
            AccessControl.supportsInterface(interfaceId) ||
            CCIPReceiver.supportsInterface(interfaceId);
    }
}
