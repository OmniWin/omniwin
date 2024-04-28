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
        ACCEPTED, // the seller stakes the nft for the raffle
        CANCELLED, // the raffle is cancelled
        CLOSING_REQUESTED, // the operator sets a winner
        ENDED, // the raffle is finished, and NFT and funds were transferred
        FAILED,
        SUCCES
    }

    enum MessageStatus {
        NOTSENT, // 0
        SENT, // 1
        PROCESSEDONDESTINATION // 2
    }

    enum MESSAGE_TYPE {
        CREATE_RAFFLE_FROM_SIDECHAIN,
        BUY_ENTRY,
        CREATE_RAFFLE_FROM_MAINCHAIN,
        PRIZE_DISTRIBUTION,
        FAILED_RAFFLE,
        MONEY_NOT_RAISED,
        IS_REFUNDABLE,
        IS_RAFFLE_CREATED
    }

    event MessageSent(bytes32 messageId);

    event RaffleCreatedFromMainChain(bytes32 indexed raffleId);

    event RaffleCreatedAck(
        bytes32 indexed raffleId,
        address indexed nftAddress,
        uint256 indexed nftId,
        ASSET_TYPE assetType
    );

    event CreateRaffleCCIPEvent(
        bytes32 raffleKey,
        address prizeAddress,
        uint256 prizeNumber,
        ASSET_TYPE assetType
    );

    event EntrySold(
        bytes32 indexed raffleId,
        address indexed buyer,
        uint256 numEntries,
        uint256 usdAmount,
        uint256 amountRaised,
        uint256 entriesLength,
        bytes32 messageId
    );

    struct EntryInfoStruct {
        STATUS status; // status of the raffle
        uint48 entriesLength; // to easy frontend, the length of the entries array is saved here
        uint256 amountRaised; // funds raised so far in wei
    }

    event RefundBoughtTickets(
        bytes32 indexed raffleId,
        uint256 amountInWeis,
        address indexed player
    );

    event CashClaimed(
        bytes32 indexed raffleId,
        address indexed seller,
        uint256 amountInWeis
    );

    event ClaimPrize(bytes32 indexed raffleId, address indexed winner);

    event WinnerSet(bytes32 indexed raffleId, address indexed winner);

    event RaffleMoneyNotRaised(bytes32 indexed raffleId);

    event MessageSentIsRefundable(
        bytes32 indexed raffleId,
        bytes32 indexed messageId
    );

    event BoughTicketRefunded(
        bytes32 indexed raffleId,
        bytes32 indexed messageId
    );

    event CheckRaffleCreation(
        bytes32 indexed raffleId,
        bytes32 indexed messageId
    );

    event RaffleFailedOnMain(
        bytes32 indexed raffleId,
        bytes32 indexed messageId
    );

    event RaffleCreatedOnMainChain(bytes32 indexed raffleId);

    error CreateRaffleError(string errorType);
    error NoPrices();
    error EntryNotAllowed(string errorType);
    error RaffleAlreadyExists();
    error NotTheOwner();
    error NotTheSeller();
    error NotTheWinner();
    error PrizeNotHere();
    error AlreadyClaimed();
    error NotTheBuyer();
    error RefundNotAvailable();
    error AckNotReceived();
    error AckAlreadyReceived();
    error FailedToSendCashForSeller();
    error NumEntriesZeroError();
    error FailedToSendEthPrize();
    error NotTheNFTOwner();
    error ContractNotApproved();
    error AllowanceError();
    error TransferFailed();
    error ETHPrizeAmountMismatch();
    error RaffleDeadlinePassed(bytes32 raffleId);
    error IncorrectUSDCAmount(uint256 providedAmount, uint256 expectedPrice);
    error USDCAallowanceTooLow();
    error USDCTransferFailed();
    error CallerNotSeller();
    error ClaimPeriodNotAvailable();
    error RaffleAlreadyProcessed();
    error FailedToSendERC721Prize();
    error FailedToSendERC20Prize();
    error WinnerAlreadySet();
    error RaffleNotCancelled();
    error RaffleNotFailed();
    error NoRefundAvailable();
    error FailedToSendRefund(address player, uint256 amount);
    error FailedToSendUnclaimedFundsToPlatform();
    error FailedToSendPlatformFee();
    error TryAgainLater();

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
        uint256 created; // timestamp of the creation of the raffle
    }

    struct BuyTicketCCIP {
        address player; // wallet address of the player
        uint256 timestamp; // Stores the timestamp of when the message was sent
        uint256 priceStructureId; // id of the price structure
        bool isRefundable; // if the message is refundable
        bool isRefunded; // if the message has been refunded
        MessageStatus status; // status of the message
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

    mapping(bytes32 => FundingStructure) public fundingList;
    mapping(bytes32 => EntryInfoStruct) public rafflesEntryInfo;
    mapping(bytes32 => mapping(address => bool)) public hasClaimedRefund;
    mapping(bytes32 => EntriesBought[]) public entriesList;
    mapping(bytes32 => PriceStructure[]) public pricesList;
    mapping(bytes32 => PriceStructure[]) public tempPricesList;
    mapping(bytes32 => RaffleStruct) public raffles;
    mapping(bytes32 => mapping(bytes32 => BuyTicketCCIP)) public entries;

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
        uint256 gasLimit
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

        // Generate a unique key
        bytes32 raffleKey = keccak256(
            abi.encodePacked(msg.sender, block.timestamp)
        );
        require(raffles[raffleKey].deadline == 0, "Raffle already exists!");

        raffles[raffleKey] = RaffleStruct({
            prizeNumber: _prizeNumber,
            prizeAddress: _prizeAddress,
            winner: address(0),
            seller: msg.sender,
            assetType: _assetType,
            deadline: 0,
            created: block.timestamp
        });

        for (uint256 i = 0; i < _prices.length; ++i) {
            pricesList[raffleKey].push(_prices[i]);
        }

        //send message to create raffle from sidechain
        sendMessage(
            abi.encode(
                MESSAGE_TYPE.CREATE_RAFFLE_FROM_SIDECHAIN,
                _minimumFundsInWei,
                _prices,
                _deadlineDuration,
                msg.sender,
                raffleKey
            ),
            gasLimit
        );

        // console.log("create raffle ccip event");
        emit CreateRaffleCCIPEvent(
            raffleKey,
            _prizeAddress,
            _prizeNumber,
            _assetType
        );

        return raffleKey;
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

        if (messageType == uint8(MESSAGE_TYPE.CREATE_RAFFLE_FROM_MAINCHAIN)) {
            handleCreateRaffleFromMainChain(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.PRIZE_DISTRIBUTION)) {
            _handlePrizeDistribution(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.MONEY_NOT_RAISED)) {
            _handleFailedRaffle(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.IS_REFUNDABLE)) {
            _handleIsRefundable(any2EvmMessage);
        }

        if (messageType == uint8(MESSAGE_TYPE.IS_RAFFLE_CREATED)) {
            _handleIsRaffleCreated(any2EvmMessage);
        }
    }

    function _handleIsRaffleCreated(
        Client.Any2EVMMessage memory message
    ) internal {
        bytes32 messageIdSourceChain = message.messageId;

        (uint8 messageType, bytes32 raffleId, bool isRaffleCreated) = abi
            .decode(message.data, (uint8, bytes32, bool));

        EntryInfoStruct storage entryInfo = rafflesEntryInfo[raffleId];

        if (!isRaffleCreated) {
            entryInfo.status = STATUS.FAILED;
            emit RaffleFailedOnMain(raffleId, messageIdSourceChain);
        } else {
            emit RaffleCreatedOnMainChain(raffleId);
        }
    }

    function _handleIsRefundable(
        Client.Any2EVMMessage memory message
    ) internal {
        (
            uint8 messageType,
            bytes32 raffleId,
            bool isRefundable,
            bytes32 messageId,
            address player
        ) = abi.decode(message.data, (uint8, bytes32, bool, bytes32, address));

        BuyTicketCCIP storage entry = entries[raffleId][messageId];

        entry.isRefundable = isRefundable;

        // Calculate refund amount based on the tickets bought by player
        uint256 refundAmount = pricesList[raffleId][
            entries[raffleId][messageId].priceStructureId
        ].price;

        if (refundAmount <= 0) {
            revert NoRefundAvailable();
        }

        // Refund the user
        bool refundSent = IERC20(usdcContractAddress).transfer(
            player,
            refundAmount
        );

        if (!refundSent) {
            revert FailedToSendRefund(player, refundAmount);
        }

        entries[raffleId][messageId].isRefunded = true;

        entry.status = MessageStatus.PROCESSEDONDESTINATION;

        emit BoughTicketRefunded(raffleId, messageId);
    }

    function _handleFailedRaffle(
        Client.Any2EVMMessage memory message
    ) internal {
        (uint8 messageType, bytes32 raffleId) = abi.decode(
            message.data,
            (uint8, bytes32)
        );

        EntryInfoStruct storage entryInfo = rafflesEntryInfo[raffleId];

        entryInfo.status = STATUS.FAILED;

        emit RaffleMoneyNotRaised(raffleId);
    }

    function _handlePrizeDistribution(
        Client.Any2EVMMessage memory message
    ) internal {
        (
            uint8 messageType,
            bytes32 raffleId,
            address winner,
            address seller,
            uint256 amountForSeller
        ) = abi.decode(
                message.data,
                (uint8, bytes32, address, address, uint256)
            );

        RaffleStruct storage raffle = raffles[raffleId];
        raffle.winner = winner;
        raffle.seller = seller;

        fundingList[raffleId].amountForSeller = amountForSeller;

        //emit event winner has been set -> claims can be made
        emit WinnerSet(raffleId, winner);
    }

    //winner claim cash raised
    function claimCash(bytes32 _raffleId) external nonReentrant {
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

    function claimPrize(bytes32 _raffleId) external nonReentrant {
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

    function handleCreateRaffleFromMainChain(
        Client.Any2EVMMessage memory message
    ) internal {
        (
            uint8 messageType,
            PriceStructure[] memory prices,
            uint256 deadline,
            bytes32 raffleId
        ) = abi.decode(
                message.data,
                (uint8, PriceStructure[], uint256, bytes32)
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
            deadline: deadline,
            created: block.timestamp
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
        bytes32 raffleId
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

    function saveEntryInfo(bytes32 raffleId) internal {
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
        bytes32 _raffleId,
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
        saveEntriesMessage(_raffleId, messageId, _id);

        emit EntrySold(
            _raffleId,
            msg.sender,
            numEntries,
            _usdcAmount,
            entryInfo.amountRaised,
            entriesLength,
            messageId
        );
    }

    function saveEntriesMessage(
        bytes32 _raffleId,
        bytes32 _messageId,
        uint48 _priceStructureId
    ) internal {
        entries[_raffleId][_messageId] = BuyTicketCCIP({
            player: msg.sender,
            timestamp: block.timestamp,
            priceStructureId: _priceStructureId,
            isRefundable: false,
            isRefunded: false,
            status: MessageStatus.NOTSENT
        });
    }

    /**
     * Refund the prize if the raffle has not been acked by the main chain
     * TODO
     */
    function reclaimAsset(bytes32 raffleId) external nonReentrant {
        RaffleStruct storage raffle = raffles[raffleId];

        if (rafflesEntryInfo[raffleId].status != STATUS.FAILED) {
            revert RaffleNotFailed();
        }

        if (raffle.seller != msg.sender) {
            revert CallerNotSeller();
        }

        if (raffles[raffleId].winner != address(0)) {
            revert WinnerAlreadySet();
        }

        if (raffle.assetType == ASSET_TYPE.ERC721) {
            IERC721(raffle.prizeAddress).transferFrom(
                address(this),
                raffle.seller,
                raffle.prizeNumber
            );

            if (
                IERC721(raffle.prizeAddress).ownerOf(raffle.prizeNumber) !=
                msg.sender
            ) {
                revert FailedToSendERC721Prize();
            }
        } else if (raffle.assetType == ASSET_TYPE.ERC20) {
            IERC20 _asset = IERC20(raffle.prizeAddress);
            _asset.transfer(raffle.seller, raffle.prizeNumber);

            if (
                !IERC20(raffle.prizeAddress).transfer(
                    raffle.seller,
                    raffle.prizeNumber
                )
            ) {
                revert FailedToSendERC20Prize();
            }
        } else if (raffle.assetType == ASSET_TYPE.ETH) {
            (bool sent, ) = payable(raffle.seller).call{
                value: raffle.prizeNumber
            }("");

            if (!sent) {
                revert FailedToSendEthPrize();
            }
        }
    }

    function calculateRefund(
        bytes32 _raffleId,
        address _player
    ) internal view returns (uint256) {
        // Ensure there's a check here to prevent out-of-bounds access
        if (entriesList[_raffleId].length == 0) {
            return 0;
        }

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

    function claimRefundBoughtTickets(bytes32 raffleId) external nonReentrant {
        if (raffles[raffleId].winner != address(0)) {
            revert WinnerAlreadySet();
        }

        //check raffle status
        if (rafflesEntryInfo[raffleId].status != STATUS.FAILED) {
            revert RaffleNotFailed();
        }

        if (hasClaimedRefund[raffleId][msg.sender]) {
            revert AlreadyClaimed();
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

    /**
     * Initiate claim refund for the following case:
     * 1. Raffle was a success
     * 2. User bought a ticket but message failed on main chain so it was not registered
     */
    function claimRefundBoughtTicketCCIP(
        bytes32 _raffleId,
        bytes32 _messageId,
        uint256 gasLimit,
        uint256 gasLimitAck
    ) external nonReentrant {
        if (entries[_raffleId][_messageId].isRefunded) {
            revert AlreadyClaimed();
        }

        if (entries[_raffleId][_messageId].player != msg.sender) {
            revert NotTheBuyer();
        }

        if (raffles[_raffleId].deadline < block.timestamp) {
            revert ClaimPeriodNotAvailable();
        }

        if (entries[_raffleId][_messageId].status == MessageStatus.NOTSENT) {
            //send message to main chain to check if the message is refundable
            bytes memory data = abi.encode(
                MESSAGE_TYPE.IS_REFUNDABLE,
                _raffleId,
                _messageId,
                gasLimitAck,
                msg.sender
            );

            bytes32 messageId = sendMessage(data, gasLimit);

            entries[_raffleId][_messageId].status = MessageStatus.SENT;

            emit MessageSentIsRefundable(_raffleId, messageId);

            return;
        }
    }

    /*
     * check if raffle has been created on the main chain
     */
    function checkRaffleCreationOnMainChain(
        bytes32 _raffleId,
        uint256 gasLimit,
        uint256 gasLimitAck
    ) external {
        //if 3days have not passed, try again later
        if (raffles[_raffleId].created + 3 days < block.timestamp) {
            revert TryAgainLater();
        }

        bytes memory data = abi.encode(
            MESSAGE_TYPE.IS_RAFFLE_CREATED,
            _raffleId,
            gasLimitAck
        );

        bytes32 messageId = sendMessage(data, gasLimit);

        emit CheckRaffleCreation(_raffleId, messageId);
    }

    //set raffle status to failed
    function setRaffleFailed(bytes32 _raffleId) external {
        if (!isOwner()) revert NotTheOwner();

        rafflesEntryInfo[_raffleId].status = STATUS.FAILED;
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
