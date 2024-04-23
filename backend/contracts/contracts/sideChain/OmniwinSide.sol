//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {LinkTokenInterface} from "@chainlink/contracts/src/v0.8/shared/interfaces/LinkTokenInterface.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract OmniwinSide is CCIPReceiver, ReentrancyGuard {
    address immutable router;
    address immutable link;

    address public owner;
    address public usdcContractAddress;
    address public mainChainRaffleAddress;
    uint64 public mainChainSelector;

    uint256 maxDeadlineDuration = 30 days;

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
        PENDING, // the raffle is pending to be created - waiting for ack from main chain
        ACCEPTED, // the seller stakes the nft for the raffle
        CANCELLED, // the raffle is cancelled
        CLOSING_REQUESTED, // the operator sets a winner
        ENDED // the raffle is finished, and NFT and funds were transferred
    }

    enum MessageStatus {
        NOTSENT, // 0
        SENT, // 1
        PROCESSEDONDESTINATION // 2
    }

    enum MESSAGE_TYPE {
        CREATE_RAFFLE_FROM_SIDECHAIN_SYN,
        CREATE_RAFFLE_ACK,
        CREATE_RAFFLE_SYN_ACK,
        BUY_ENTRY,
        CREATE_RAFFLE_FROM_MAINCHAIN,
        PRIZE_DISTRIBUTION,
        MONEY_NOT_RAISED
    }

    event MessageSent(bytes32 messageId);

    event RaffleCreatedFromMainChain(uint256 indexed raffleId);

    event RaffleCreatedAck(
        uint256 indexed raffleId,
        address indexed nftAddress,
        uint256 indexed nftId,
        ASSET_TYPE assetType
    );

    event CreateRaffleCCIPEvent(
        bytes32 messageId,
        address prizeAddress,
        uint256 prizeNumber,
        ASSET_TYPE assetType
    );

    event EntrySold(
        uint256 indexed raffleId,
        address indexed buyer,
        uint256 numEntries,
        uint256 usdAmount,
        uint256 amountRaised,
        uint256 entriesLength
    );

    struct EntryInfoStruct {
        STATUS status; // status of the raffle
        uint48 entriesLength; // to easy frontend, the length of the entries array is saved here
        uint256 amountRaised; // funds raised so far in wei
    }

    event RefundBoughtTickets(
        uint256 indexed raffleId,
        uint256 amountInWeis,
        address indexed player
    );

    event CashClaimed(
        uint256 indexed raffleId,
        address indexed seller,
        uint256 amountInWeis
    );

    event ClaimPrize(uint256 indexed raffleId, address indexed winner);

    event WinnerSet(uint256 indexed raffleId, address indexed winner);

    event RaffleMoneyNotRaised(uint256 indexed raffleId);

    error CreateRaffleError(string errorType);
    error NoPrices();
    error EntryNotAllowed(string errorType);
    error RaffleAlreadyExists();
    error NotTheOwner();
    error NotTheSeller();
    error NotTheWinner();
    error PrizeNotHere();
    error AlreadyClaimed();
    error FailedToSendCashForSeller();
    error NumEntriesZeroError();
    error FailedToSendEthPrize();
    error NotTheNFTOwner();
    error ContractNotApproved();
    error AllowanceError();
    error TransferFailed();
    error ETHPrizeAmountMismatch();
    error RaffleDeadlinePassed(uint256 raffleId);
    error IncorrectUSDCAmount(uint256 providedAmount, uint256 expectedPrice);
    error USDCAallowanceTooLow();
    error USDCTransferFailed();
    error CallerNotSeller();
    error ClaimPeriodNotAvailable();
    error RaffleAlreadyProcessed();
    error FailedToSendERC721Prize();
    error FailedToSendERC20Prize();
    error WinnerAlreadySet(uint256 raffleId);
    error RaffleNotCancelled();
    error NoRefundAvailable();
    error FailedToSendRefund(address player, uint256 amount);
    error FailedToSendUnclaimedFundsToPlatform();
    error FailedToSendPlatformFee();

    // Every raffle has a funding structure.
    struct FundingStructure {
        uint128 minimumFundsInWeis;
        bool platformFeeCollected;
        bool prizeClaimed;
        bool cashClaimed;
        uint256 amountForSeller;
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
        uint64 chainSelector;
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
        owner = msg.sender;
    }

    receive() external payable {}

    function isOwner() internal view returns (bool) {
        return msg.sender == owner;
    }

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
    ) external {
        if (!isOwner()) revert NotTheOwner();
        allowlistedDestinationChains[_destinationChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a source chain for transactions.
    function allowlistSourceChain(
        uint64 _sourceChainSelector,
        bool allowed
    ) external {
        if (!isOwner()) revert NotTheOwner();
        allowlistedSourceChains[_sourceChainSelector] = allowed;
    }

    /// @dev Updates the allowlist status of a sender for transactions.
    function allowlistSender(address _sender, bool allowed) external {
        if (!isOwner()) revert NotTheOwner();
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
     */
    function CreateRaffleCCIP(
        address _prizeAddress,
        uint256 _prizeNumber,
        uint128 _minimumFundsInWei,
        PriceStructure[] calldata _prices,
        ASSET_TYPE _assetType,
        uint256 _deadlineDuration,
        uint256 gasLimitSyn,
        uint256 gasLimitSynAck,
        uint256 gasLimitAck
    ) external payable returns (bytes32) {
        require(
            _deadlineDuration <= maxDeadlineDuration,
            "Deadline exceeds maximum duration"
        );

        uint256 prizesLength = _prices.length;
        if (prizesLength == 0) revert NoPrices();

        for (uint256 i = 0; i < _prices.length; ++i) {
            if (_prices[i].numEntries == 0) {
                revert NumEntriesZeroError();
            }
        }

        // Handle the transfer and ownership validation based on asset type
        handleAssetTransferAndValidation(
            msg.sender,
            address(this),
            _prizeAddress,
            _prizeNumber,
            _assetType
        );

        //TODO: bring back here _sendMessageCreateRaffleSideChain, and replace testMessageId with messageId
        // bytes32 messageId = 0x894cccafe7a46ef3ce0297f766eb759c3aa439ab77472626d2ba98088308cee4;
        //send message to create raffle from sidechain
        bytes32 messageId = sendMessage(
            abi.encode(
                MESSAGE_TYPE.CREATE_RAFFLE_FROM_SIDECHAIN_SYN,
                _minimumFundsInWei,
                _prices,
                _deadlineDuration,
                msg.sender,
                gasLimitSynAck,
                gasLimitAck
            ),
            gasLimitSyn
        );

        tempRaffles[messageId] = RaffleStructTemp({
            prizeNumber: _prizeNumber,
            prizeAddress: _prizeAddress,
            winner: address(0),
            seller: msg.sender,
            assetType: _assetType,
            deadline: 0,
            msgStatus: MessageStatus.SENT,
            timestamp: uint48(block.timestamp)
        });

        for (uint256 i = 0; i < _prices.length; ++i) {
            tempPricesList[messageId].push(_prices[i]);
        }

        // console.log("create raffle ccip event");
        emit CreateRaffleCCIPEvent(
            messageId,
            _prizeAddress,
            _prizeNumber,
            _assetType
        );

        return messageId;
    }

    //set mainChainSelector
    function setMainChainSelector(uint64 _mainChainSelector) external {
        if (!isOwner()) revert NotTheOwner();
        mainChainSelector = _mainChainSelector;
    }

    //set mainChainRaffleAddress
    function setMainChainRaffleAddress(
        address _mainChainRaffleAddress
    ) external {
        if (!isOwner()) revert NotTheOwner();
        mainChainRaffleAddress = _mainChainRaffleAddress;
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    )
        internal
        override
        onlyAllowlisted(
            any2EvmMessage.sourceChainSelector,
            abi.decode(any2EvmMessage.sender, (address))
        )
    {
        uint8 messageType = abi.decode(any2EvmMessage.data, (uint8));

        if (messageType == uint8(MESSAGE_TYPE.CREATE_RAFFLE_SYN_ACK)) {
            _handleCreateRaffleSynAck(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.CREATE_RAFFLE_FROM_MAINCHAIN)) {
            handleCreateRaffleFromMainChain(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.PRIZE_DISTRIBUTION)) {
            _handlePrizeDistribution(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.MONEY_NOT_RAISED)) {
            _handleFailedRaffle(any2EvmMessage);
        }
    }

    function _handleFailedRaffle(
        Client.Any2EVMMessage memory message
    ) internal {
        (uint8 messageType, uint256 raffleId) = abi.decode(
            message.data,
            (uint8, uint256)
        );

        EntryInfoStruct storage entryInfo = rafflesEntryInfo[raffleId];

        entryInfo.status = STATUS.CANCELLED;

        emit RaffleMoneyNotRaised(raffleId);
    }

    function _handlePrizeDistribution(
        Client.Any2EVMMessage memory message
    ) internal {
        (
            uint8 messageType,
            uint256 raffleId,
            address winner,
            address seller,
            uint256 amountForSeller
        ) = abi.decode(
                message.data,
                (uint8, uint256, address, address, uint256)
            );

        RaffleStruct storage raffle = raffles[raffleId];
        raffle.winner = winner;
        raffle.seller = seller;

        fundingList[raffleId].amountForSeller = amountForSeller;

        //emit event winner has been set -> claims can be made
        emit WinnerSet(raffleId, winner);
    }

    //winner claim cash raised
    function claimCash(uint256 _raffleId) external nonReentrant {
        RaffleStruct storage raffle = raffles[_raffleId];

        IERC20 usdc = IERC20(usdcContractAddress);
        uint256 totalAmount = rafflesEntryInfo[_raffleId].amountRaised;

        //if 365 days passed, the platform can claim the cash
        if (raffle.deadline + 365 days < block.timestamp) {
            //transfer the prize to the owner
            if (!usdc.transfer(owner, totalAmount)) {
                revert FailedToSendUnclaimedFundsToPlatform();
            }
        }

        if (raffle.seller != msg.sender) {
            revert NotTheSeller();
        }

        if (fundingList[_raffleId].cashClaimed) {
            revert AlreadyClaimed();
        }

        //check contract balance of usdc
        if (
            !usdc.transfer(msg.sender, fundingList[_raffleId].amountForSeller)
        ) {
            revert FailedToSendCashForSeller();
        }

        fundingList[_raffleId].cashClaimed = true;
        uint256 platformFee = totalAmount -
            fundingList[_raffleId].amountForSeller;

        //Send the fee to the platform: totalAmount - amountForSeller + unreached bought entries to main chain
        if (platformFee > 0) {
            if (!usdc.transfer(owner, platformFee)) {
                revert FailedToSendPlatformFee();
            }
        }

        emit CashClaimed(
            _raffleId,
            msg.sender,
            fundingList[_raffleId].amountForSeller
        );
    }

    function claimPrize(uint256 _raffleId) external nonReentrant {
        RaffleStruct storage raffle = raffles[_raffleId];

        //TODO: refactor this to a function
        //if 365 days passed, the platform can claim the cash
        if (raffle.deadline + 365 days < block.timestamp) {
            //transfer the prize to the owner
            transferAsset(address(this), owner, _raffleId);
        }

        if (raffle.assetType == ASSET_TYPE.CCIP) {
            revert PrizeNotHere();
        }

        if (raffle.winner != msg.sender) {
            revert NotTheWinner();
        }

        if (fundingList[_raffleId].prizeClaimed) {
            revert AlreadyClaimed();
        }

        transferAsset(address(this), msg.sender, _raffleId);

        fundingList[_raffleId].prizeClaimed = true;

        emit ClaimPrize(_raffleId, msg.sender);
    }

    function _handleCreateRaffleSynAck(
        Client.Any2EVMMessage memory message
    ) internal {
        (
            uint8 messageType,
            bytes32 messageId,
            uint256 raffleId,
            uint256 deadline,
            uint256 gasLimitAck
        ) = abi.decode(
                message.data,
                (uint8, bytes32, uint256, uint256, uint256)
            );

        RaffleStructTemp memory tempRaffle = tempRaffles[messageId];
        PriceStructure[] memory prices = tempPricesList[messageId];

        raffles[raffleId] = RaffleStruct({
            prizeNumber: tempRaffle.prizeNumber,
            prizeAddress: tempRaffle.prizeAddress,
            winner: address(0),
            seller: tempRaffle.seller,
            assetType: tempRaffle.assetType,
            deadline: deadline
        });

        for (uint256 i = 0; i < prices.length; ++i) {
            pricesList[raffleId].push(prices[i]);
        }

        saveEntryInfo(raffleId);

        fundingList[raffleId] = FundingStructure({
            minimumFundsInWeis: 0,
            platformFeeCollected: false,
            prizeClaimed: false,
            cashClaimed: false,
            amountForSeller: 0
        });

        tempRaffles[messageId].msgStatus = MessageStatus.PROCESSEDONDESTINATION;

        bytes memory data = abi.encode(
            MESSAGE_TYPE.CREATE_RAFFLE_ACK,
            raffleId
        );

        console.log(
            "sidechain syn ack, send ack to main chain with raffleId: ",
            raffleId
        );
        sendMessage(data, gasLimitAck);

        emit RaffleCreatedAck(
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

        if (raffles[raffleId].deadline != 0) {
            revert RaffleAlreadyExists();
        }

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

        fundingList[raffleId] = FundingStructure({
            minimumFundsInWeis: 0,
            platformFeeCollected: false,
            prizeClaimed: false,
            cashClaimed: false,
            amountForSeller: 0
        });

        emit RaffleCreatedFromMainChain(raffleId);
    }

    function transferAsset(
        address from,
        address to,
        uint256 raffleId
    ) internal {
        RaffleStruct storage raffle = raffles[raffleId];

        if (raffle.assetType == ASSET_TYPE.ERC721) {
            IERC721(raffle.prizeAddress).transferFrom(
                from,
                to,
                raffle.prizeNumber
            );
        } else if (raffle.assetType == ASSET_TYPE.ERC20) {
            require(
                IERC20(raffle.prizeAddress).transfer(to, raffle.prizeNumber),
                "Transfer failed"
            );
        } else if (raffle.assetType == ASSET_TYPE.ETH) {
            (bool sent, ) = to.call{value: raffle.prizeNumber}("");
            require(sent, "Failed to send ETH");
        }
    }

    function handleAssetTransferAndValidation(
        address sender,
        address recipient,
        address _prizeAddress,
        uint256 _prizeNumber,
        ASSET_TYPE _assetType
    ) internal {
        if (_assetType == ASSET_TYPE.ERC721) {
            IERC721 prizeToken = IERC721(_prizeAddress);
            if (prizeToken.ownerOf(_prizeNumber) != sender) {
                revert NotTheNFTOwner();
            }

            if (
                !(prizeToken.isApprovedForAll(sender, recipient) ||
                    prizeToken.getApproved(_prizeNumber) == recipient)
            ) {
                revert ContractNotApproved();
            }

            prizeToken.transferFrom(sender, recipient, _prizeNumber);
        } else if (_assetType == ASSET_TYPE.ERC20) {
            IERC20 prizeToken = IERC20(_prizeAddress);
            if (prizeToken.allowance(sender, recipient) < _prizeNumber) {
                revert AllowanceError();
            }

            if (!prizeToken.transferFrom(sender, recipient, _prizeNumber)) {
                revert TransferFailed();
            }
        } else if (_assetType == ASSET_TYPE.ETH) {
            if (msg.value != _prizeNumber) {
                revert ETHPrizeAmountMismatch();
            }
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
        uint256 _usdcAmount,
        uint256 gasLimit
    ) external payable {
        if (tx.origin != msg.sender)
            revert EntryNotAllowed("No contracts allowed");
        EntryInfoStruct storage entryInfo = rafflesEntryInfo[_raffleId];
        if (entryInfo.status != STATUS.ACCEPTED)
            revert EntryNotAllowed("Not in ACCEPTED");

        if (block.timestamp > raffles[_raffleId].deadline) {
            revert RaffleDeadlinePassed(_raffleId);
        }

        // Price checks
        PriceStructure memory priceStruct = pricesList[_raffleId][_id];

        if (_usdcAmount != priceStruct.price) {
            revert IncorrectUSDCAmount(_usdcAmount, priceStruct.price);
        }

        // // Ensure the contract is allowed to transfer the specified amount of USDC on behalf of the sender
        IERC20 usdc = IERC20(usdcContractAddress);

        uint256 allowance = usdc.allowance(msg.sender, address(this));
        if (allowance < _usdcAmount) {
            revert USDCAallowanceTooLow();
        }

        if (!usdc.transferFrom(msg.sender, address(this), _usdcAmount)) {
            revert USDCTransferFailed();
        }

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

        bytes memory data = abi.encode(messageType, _raffleId, msg.sender, _id);

        //sent bought entry to main chain
        bytes32 messageId = sendMessage(data, gasLimit);

        //hold for refund
        entries[messageId] = MessageCCIPStatus({
            status: MessageStatus.SENT,
            timestamp: block.timestamp,
            priceStructureId: _id
        });

        emit EntrySold(
            _raffleId,
            msg.sender,
            numEntries,
            _usdcAmount,
            entryInfo.amountRaised,
            entriesLength
        );
    }

    /**
     * Refund the prize if the raffle has not been acked by the main chain
     */
    function refundPrize(bytes32 messageId) external nonReentrant {
        RaffleStructTemp storage tempRaffle = tempRaffles[messageId];

        if (tempRaffle.seller != msg.sender) {
            revert CallerNotSeller();
        }

        //if ack not received in 24 hours, refund the prize
        if (block.timestamp < tempRaffle.timestamp + 24 hours) {
            revert ClaimPeriodNotAvailable();
        }

        if (tempRaffle.msgStatus != MessageStatus.SENT) {
            revert RaffleAlreadyProcessed();
        }

        if (tempRaffle.assetType == ASSET_TYPE.ERC721) {
            IERC721(tempRaffle.prizeAddress).transferFrom(
                address(this),
                tempRaffle.seller,
                tempRaffle.prizeNumber
            );

            if (
                IERC721(tempRaffle.prizeAddress).ownerOf(
                    tempRaffle.prizeNumber
                ) != msg.sender
            ) {
                revert FailedToSendERC721Prize();
            }
        } else if (tempRaffle.assetType == ASSET_TYPE.ERC20) {
            IERC20 _asset = IERC20(tempRaffle.prizeAddress);
            _asset.transfer(tempRaffle.seller, tempRaffle.prizeNumber);

            if (
                !IERC20(tempRaffle.prizeAddress).transfer(
                    tempRaffle.seller,
                    tempRaffle.prizeNumber
                )
            ) {
                revert FailedToSendERC20Prize();
            }
        } else if (tempRaffle.assetType == ASSET_TYPE.ETH) {
            (bool sent, ) = payable(tempRaffle.seller).call{
                value: tempRaffle.prizeNumber
            }("");

            if (!sent) {
                revert FailedToSendEthPrize();
            }
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

    function claimRefundBoughtTickets(uint256 raffleId) external nonReentrant {
        if (raffles[raffleId].winner != address(0)) {
            revert WinnerAlreadySet(raffleId);
        }

        //check raffle status
        if (rafflesEntryInfo[raffleId].status != STATUS.CANCELLED) {
            revert RaffleNotCancelled();
        }

        // Ensure there's a check here to prevent out-of-bounds access
        if (entriesList[raffleId].length == 0) {
            return;
        }

        // Calculate refund amount based on the tickets bought by msg.sender
        uint256 refundAmount = calculateRefund(raffleId, msg.sender);

        if (refundAmount <= 0) {
            revert NoRefundAvailable();
        }

        // Refund the user
        bool refundSent = IERC20(usdcContractAddress).transfer(
            msg.sender,
            refundAmount
        );

        if (!refundSent) {
            revert FailedToSendRefund(msg.sender, refundAmount);
        }

        hasClaimedRefund[raffleId][msg.sender] = true;

        emit RefundBoughtTickets(raffleId, refundAmount, msg.sender);
    }

    function setUSDCTokenAddress(address _usdcContractAddress) external {
        if (!isOwner()) revert NotTheOwner();
        usdcContractAddress = _usdcContractAddress;
    }

    function sendMessage(
        bytes memory data,
        uint256 gasLimit
    ) internal returns (bytes32 messageId) {
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(mainChainRaffleAddress),
            data: data,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: gasLimit})
            ),
            feeToken: link
        });

        // Calculate the fee
        uint256 feeCCIP = IRouterClient(router).getFee(
            mainChainSelector,
            message
        );

        // Approve the router to spend the fee
        LinkTokenInterface(link).approve(router, feeCCIP);

        // Send the message via CCIP
        messageId = IRouterClient(router).ccipSend(mainChainSelector, message);

        return messageId;
    }
}
