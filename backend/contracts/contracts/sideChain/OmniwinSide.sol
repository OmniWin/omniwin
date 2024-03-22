//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract OmniwinSide is AccessControl, CCIPReceiver, ReentrancyGuard {
    address immutable router;
    address immutable link;

    address public usdcContractAddress;
    address public mainChainRaffleAddress;
    uint64 public mainChainSelector;

    uint256 maxDeadlineDuration = 30 days;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR");

    bytes32 public tempMessageId;

    enum PayFeesIn {
        Native,
        LINK
    }

    enum ASSET_TYPE {
        ERC20,
        ERC721,
        ETH,
        CCIP
    }

    enum STATUS {
        ACCEPTED, // the seller stakes the nft for the raffle
        PENDING, // the raffle is pending to be created - waiting for ack from main chain
        CANCELLED, // the operator cancels the raffle and transfer the remaining funds after 30 days passes
        CLOSING_REQUESTED, // the operator sets a winner
        ENDED, // the raffle is finished, and NFT and funds were transferred
        CANCEL_REQUESTED // operator asks to cancel the raffle. Players has 30 days to ask for a refund
    }

    enum MessageStatus {
        NOTSENT, // 0
        SENT, // 1
        PROCESSEDONDESTINATION // 2
    }

    enum MESSAGE_TYPE {
        CREATE_RAFFLE_FROM_SIDECHAIN,
        CREATE_RAFFLE_ACK,
        BUY_ENTRY,
        CREATE_RAFFLE_FROM_MAINCHAIN
    }

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
        address prizeAddress,
        uint256 prizeNumber
    );

    event EntrySold(
        uint256 indexed raffleId,
        address indexed buyer,
        uint256 numEntries,
        uint256 usdAmount
    );

    struct EntryInfoStruct {
        STATUS status; // status of the raffle
        uint48 entriesLength; // to easy frontend, the length of the entries array is saved here
        uint256 amountRaised; // funds raised so far in wei
    }

    event Refund(
        uint256 indexed raffleId,
        uint256 amountInWeis,
        address indexed player
    );

    error CreateRaffleError(string errorType);
    error EntryNotAllowed(string errorType);

    // Every raffle has a funding structure.
    struct FundingStructure {
        uint128 minimumFundsInWeis;
    }

    struct CreateRaffle {
        uint256 number;
        string text;
        address addr;
    }

    struct PriceStructure {
        uint48 numEntries;
        uint256 price;
    }

    // Main raffle data struct
    struct RaffleStruct {
        uint256 prizeNumber; // number (can be a percentage, an id, an amount, etc. depending on the competition)
        address prizeAddress; // address of the prize
        address winner; // address of thed winner of the raffle. Address(0) if no winner yet
        address seller; // address of the seller of the NFT
        ASSET_TYPE assetType; // type of the asset. Can be ERC20, ERC721, ETH
        uint256 deadline; // deadline to set a winner
    }

    struct MessageCCIPStatus {
        MessageStatus status; // Status of the message
        uint256 timestamp; // Stores the timestamp of when the message was sent
        uint256 priceStructureId; // id of the price structure
    }

    struct RaffleStructTemp {
        uint256 prizeNumber; // number (can be a percentage, an id, an amount, etc. depending on the competition)
        address prizeAddress; // address of the prize
        address winner; // address of thed winner of the raffle. Address(0) if no winner yet
        address seller; // address of the seller of the NFT
        ASSET_TYPE assetType; // type of the asset. Can be ERC20, ERC721, ETH
        uint256 deadline; // deadline to set a winner
        MessageStatus msgStatus; // status of the message
        uint48 timestamp; // timestamp of the message
    }

    // In order to calculate the winner, in this struct is saved for each bought the data
    struct EntriesBought {
        uint48 currentEntriesLength; // current amount of entries bought in the raffle
        address player; // wallet address of the player
        uint48 priceStructureId; // id of the price structure
    }

    struct SChains {
        address ccnsReceiverAddress;
        uint256 gasLimit;
        bool strict;
    }

    mapping(uint64 => bool) public allowlistedDestinationChains;
    mapping(uint64 => bool) public allowlistedSourceChains;
    mapping(address => bool) public allowlistedSenders;

    error DestinationChainNotAllowlisted(uint64 destinationChainSelector); // Used when the destination chain has not been allowlisted by the contract owner.
    error SourceChainNotAllowlisted(uint64 sourceChainSelector); // Used when the source chain has not been allowlisted by the contract owner.
    error SenderNotAllowlisted(address sender); // Used when the sender has not been allowlisted by the contract owner.

    mapping(uint256 => FundingStructure) public fundingList;
    mapping(uint256 => EntryInfoStruct) public rafflesEntryInfo;
    mapping(uint256 => mapping(address => bool)) public hasClaimedRefund;
    mapping(uint256 => EntriesBought[]) public entriesList;
    mapping(uint256 => PriceStructure[]) public pricesList;
    mapping(bytes32 => PriceStructure[]) public tempPricesList;
    mapping(uint256 => RaffleStruct) public raffles;
    mapping(bytes32 => RaffleStructTemp) public tempRaffles;
    mapping(bytes32 => MessageCCIPStatus) public entries;

    constructor(address _router, address _link) CCIPReceiver(_router) {
        router = _router;
        link = _link;

        _setupRole(OPERATOR_ROLE, msg.sender);
    }

    receive() external payable {}

    /// @dev Modifier that checks if the chain with the given destinationChainSelector is allowlisted.
    /// @param _destinationChainSelector The selector of the destination chain.
    modifier onlyAllowlistedDestinationChain(uint64 _destinationChainSelector) {
        if (!allowlistedDestinationChains[_destinationChainSelector])
            revert DestinationChainNotAllowlisted(_destinationChainSelector);
        _;
    }

    /// @dev Modifier that checks if the chain with the given sourceChainSelector is allowlisted and if the sender is allowlisted.
    /// @param _sourceChainSelector The selector of the destination chain.
    /// @param _sender The address of the sender.
    modifier onlyAllowlisted(uint64 _sourceChainSelector, address _sender) {
        if (!allowlistedSourceChains[_sourceChainSelector])
            revert SourceChainNotAllowlisted(_sourceChainSelector);
        if (!allowlistedSenders[_sender]) revert SenderNotAllowlisted(_sender);
        _;
    }

    /// @dev Updates the allowlist status of a destination chain for transactions.
    function allowlistDestinationChain(
        uint64 _destinationChainSelector,
        bool allowed
    ) external onlyRole(OPERATOR_ROLE) {
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a source chain for transactions.
    function allowlistSourceChain(
        uint64 _sourceChainSelector,
        bool allowed
    ) external onlyRole(OPERATOR_ROLE) {
        allowlistedSourceChains[_sourceChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a sender for transactions.
    function allowlistSender(
        address _sender,
        bool allowed
    ) external onlyRole(OPERATOR_ROLE) {
        allowlistedSenders[_sender] = allowed;
    }

    /**
     * Create a raffle from the sidechain to the mainchain and hold the prize
     *
     * @param _prizeAddress adress if the prize (ERC20, ERC721 or ETH)
     * @param _prizeNumber tokenId or amount of the prize
     * @param _assetType can be ERC20, ERC721 or ETH
     * @param _minimumFundsInWei minimum funds to be raised in wei usd
     * @param _prices array of price structures
     * @param _deadlineDuration duration of the raffle
     * @param chainIds array of chain ids to send the message
     */
    function CreateRaffleCCIP(
        address _prizeAddress,
        uint256 _prizeNumber,
        uint128 _minimumFundsInWei,
        PriceStructure[] calldata _prices,
        ASSET_TYPE _assetType,
        uint256 _deadlineDuration,
        uint64[] calldata chainIds
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

        //TODO: bring back here _sendMessageCreateRaffleSideChain, and replace testMessageId with messageId
        bytes32 testMessageId = 0x894cccafe7a46ef3ce0297f766eb759c3aa439ab77472626d2ba98088308cee4;

        tempRaffles[testMessageId] = RaffleStructTemp({
            prizeNumber: _prizeNumber,
            prizeAddress: _prizeAddress,
            winner: address(0),
            seller: msg.sender,
            assetType: _assetType,
            deadline: block.timestamp + _deadlineDuration,
            msgStatus: MessageStatus.SENT,
            timestamp: uint48(block.timestamp)
        });
        console.log("testMessageId");
        console.logBytes32(testMessageId);
        console.log("tempRaffles[testMessageId]");
        tempMessageId = testMessageId;

        // console.log("messageId-initial");
        // bytes memory messageId_ = abi.encode(messageId);
        // console.logBytes(messageId_);
        // console.log("messageId-end");

        for (uint256 i = 0; i < _prices.length; ++i) {
            tempPricesList[testMessageId].push(_prices[i]);
        }

        emit CreateRaffleCCIPEvent(
            testMessageId,
            mainChainSelector,
            mainChainRaffleAddress,
            _prizeAddress,
            _prizeNumber
        );

        bytes32 messageId = _sendMessageCreateRaffleSideChain(
            _minimumFundsInWei,
            _prices,
            _deadlineDuration,
            msg.sender,
            chainIds
        );

        console.log("messageId");
        console.logBytes32(messageId);
        console.log("tempMessageId");
    }

    function _sendMessageCreateRaffleSideChain(
        uint128 _minimumFundsInWei,
        PriceStructure[] calldata _prices,
        uint256 _deadlineDuration,
        address sender,
        uint64[] calldata chainIds
    ) internal returns (bytes32 messageId) {
        MESSAGE_TYPE messageType = MESSAGE_TYPE.CREATE_RAFFLE_FROM_SIDECHAIN;
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(mainChainRaffleAddress),
            data: abi.encode(
                messageType,
                _minimumFundsInWei,
                _prices,
                _deadlineDuration,
                sender,
                chainIds
            ),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                // Additional arguments, setting gas limit
                //TODO: //set gas limit using a function. This method needs more gas than the default
                //or maybe set is as a parameter, because if one of the chains is ethereum it will need more gas
                Client.EVMExtraArgsV1({gasLimit: 1_000_000})
            ),
            feeToken: link
        });

        uint256 fee = IRouterClient(router).getFee(mainChainSelector, message);
        LinkTokenInterface(link).approve(router, fee);
        messageId = IRouterClient(router).ccipSend(mainChainSelector, message);
        return messageId;
    }

    //set mainChainSelector
    function setMainChainSelector(
        uint64 _mainChainSelector
    ) external onlyRole(OPERATOR_ROLE) {
        mainChainSelector = _mainChainSelector;
    }

    //set mainChainRaffleAddress
    function setMainChainRaffleAddress(
        address _mainChainRaffleAddress
    ) external onlyRole(OPERATOR_ROLE) {
        mainChainRaffleAddress = _mainChainRaffleAddress;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage // onlyAllowlisted(
        //     abi.decode(any2EvmMessage.sender, (address))
    ) internal override //     any2EvmMessage.sourceChainSelector,
    // )
    {
        uint8 messageType = abi.decode(any2EvmMessage.data, (uint8));

        if (messageType == uint8(MESSAGE_TYPE.CREATE_RAFFLE_ACK)) {
            handleCreateRaffleAck(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.CREATE_RAFFLE_FROM_MAINCHAIN)) {
            handleCreateRaffleFromMainChain(any2EvmMessage);
        }
    }

    function handleCreateRaffleAck(
        Client.Any2EVMMessage memory message
    ) internal {
        (uint8 messageType, bytes32 messageId, uint256 raffleId) = abi.decode(
            message.data,
            (uint8, bytes32, uint256)
        );

        RaffleStructTemp memory tempRaffle = tempRaffles[messageId];
        PriceStructure[] memory prices = tempPricesList[messageId];

        raffles[raffleId] = RaffleStruct({
            prizeNumber: tempRaffle.prizeNumber,
            prizeAddress: tempRaffle.prizeAddress,
            winner: address(0),
            seller: tempRaffle.seller,
            assetType: tempRaffle.assetType,
            deadline: tempRaffle.deadline
        });

        for (uint256 i = 0; i < prices.length; ++i) {
            pricesList[raffleId].push(prices[i]);
        }

        saveEntryInfo(raffleId);

        fundingList[raffleId] = FundingStructure({minimumFundsInWeis: 0});

        tempRaffles[messageId].msgStatus = MessageStatus.PROCESSEDONDESTINATION;

        emit RaffleCreated(
            raffleId,
            tempRaffle.prizeAddress,
            tempRaffle.prizeNumber,
            tempRaffle.assetType
        );
    }

    function handleCreateRaffleFromMainChain(
        Client.Any2EVMMessage memory message
    ) internal {
        (
            uint8 messageType,
            PriceStructure[] memory prices,
            uint256 deadline,
            uint256 raffleId
        ) = abi.decode(
                message.data,
                (uint8, PriceStructure[], uint256, uint256)
            );

        raffles[raffleId] = RaffleStruct({
            prizeNumber: 0,
            prizeAddress: address(0),
            winner: address(0),
            seller: address(0),
            assetType: ASSET_TYPE.CCIP,
            deadline: deadline
        });

        for (uint256 i = 0; i < prices.length; ++i) {
            pricesList[raffleId].push(prices[i]);
        }

        saveEntryInfo(raffleId);

        fundingList[raffleId] = FundingStructure({minimumFundsInWeis: 0});

        emit RaffleCreated(raffleId, address(0), 0, ASSET_TYPE.CCIP);
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
            status: STATUS.ACCEPTED,
            amountRaised: 0,
            entriesLength: 0
        });
        rafflesEntryInfo[raffleId] = entryInfo;
    }

    /** Buy an entry in a raffle with USDC, only if the raffle has been created on the main chain
     * The entry is sent to the main chain
     *
     *
     * @param _raffleId raffle id
     * @param _id price structure id
     * @param _usdcAmount amount of usdc to buy the entry
     */
    function buyEntry(
        uint256 _raffleId,
        uint48 _id,
        uint256 _usdcAmount
    ) external payable {
        if (tx.origin != msg.sender)
            revert EntryNotAllowed("No contracts allowed");
        EntryInfoStruct storage entryInfo = rafflesEntryInfo[_raffleId];
        if (entryInfo.status != STATUS.ACCEPTED)
            revert EntryNotAllowed("Not in ACCEPTED");

        require(
            block.timestamp < raffles[_raffleId].deadline,
            "Raffle deadline has passed"
        );

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

        MESSAGE_TYPE messageType = MESSAGE_TYPE.BUY_ENTRY;

        //sent bought entry to main chain
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(mainChainRaffleAddress),
            data: abi.encode(messageType, _raffleId, msg.sender, _id),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: link
        });

        uint256 fee = IRouterClient(router).getFee(mainChainSelector, message);

        bytes32 messageId;

        LinkTokenInterface(link).approve(router, fee);
        messageId = IRouterClient(router).ccipSend(mainChainSelector, message);
        //hold for refund
        entries[messageId] = MessageCCIPStatus({
            status: MessageStatus.SENT,
            timestamp: block.timestamp,
            priceStructureId: _id
        });

        emit EntrySold(_raffleId, msg.sender, numEntries, _usdcAmount);
    }

    /**
     * Refund the prize if the raffle has not been acked by the main chain
     */
    function refundPrize(bytes32 messageId) external nonReentrant {
        RaffleStructTemp storage tempRaffle = tempRaffles[messageId];

        require(tempRaffle.seller == msg.sender, "Caller is not the seller");

        // Check the timeout
        require(
            block.timestamp >= tempRaffle.timestamp + 24 hours,
            "Claim period not yet available"
        );

        // Ensure the raffle hasn't been acknowledged/processed
        require(
            tempRaffle.msgStatus == MessageStatus.SENT,
            "Raffle already processed"
        );

        if (tempRaffle.assetType == ASSET_TYPE.ERC721) {
            IERC721(tempRaffle.prizeAddress).transferFrom(
                address(this),
                tempRaffle.seller,
                tempRaffle.prizeNumber
            );
        } else if (tempRaffle.assetType == ASSET_TYPE.ERC20) {
            IERC20 _asset = IERC20(tempRaffle.prizeAddress);
            _asset.transfer(tempRaffle.seller, tempRaffle.prizeNumber);
        } else if (tempRaffle.assetType == ASSET_TYPE.ETH) {
            (bool sent, ) = payable(tempRaffle.seller).call{
                value: tempRaffle.prizeNumber
            }("");
            require(sent, "Failed to send ETH to seller");
        }

        delete tempRaffles[messageId];
    }

    function calculateRefund(
        uint256 _raffleId,
        address _player
    ) internal view returns (uint256) {
        uint256 refundAmount = 0;
        uint256 entriesLength = entriesList[_raffleId].length;

        for (uint48 i = 0; i < entriesLength; i++) {
            if (entriesList[_raffleId][i].player == _player) {
                uint48 priceStructureId = entriesList[_raffleId][i]
                    .priceStructureId;
                refundAmount += pricesList[_raffleId][priceStructureId].price;
            }
        }
        return refundAmount;
    }

    function claimRefundTickets() external nonReentrant {
        uint256 raffleId = 0;
        require(
            raffles[raffleId].deadline + 24 hours < block.timestamp,
            "Raffle deadline plus 24-hour grace period has not passed"
        );

        require(raffles[raffleId].winner == address(0), "Winner already set");

        // Ensure there's a check here to prevent out-of-bounds access
        if (entriesList[raffleId].length == 0) {
            return;
        }

        // Calculate refund amount based on the tickets bought by msg.sender
        uint256 refundAmount = calculateRefund(raffleId, msg.sender);
        require(refundAmount > 0, "No refund available");

        // Mark as claimed
        hasClaimedRefund[raffleId][msg.sender] = true;

        // Refund the user
        IERC20 usdc = IERC20(usdcContractAddress);
        require(
            usdc.transfer(msg.sender, refundAmount),
            "Failed to send refund"
        );

        emit Refund(raffleId, refundAmount, msg.sender);
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
