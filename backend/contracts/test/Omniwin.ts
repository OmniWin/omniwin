//https://blog.openzeppelin.com/introducing-openzeppelin-defender-2-0
import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import {routerConfig} from "../constants/constants"
import { omniwinMainSol } from "../typechain-types/contracts/mainChain";
import exp from "constants";
enum ASSET_TYPE {
    ERC20,
    ERC721,
    ETH,
    CCIP
}

describe("Omniwin", function () {
    async function deployNftContract() {
        const nft = await ethers.deployContract("OmniwinNFT721");
        await nft.waitForDeployment();

        return nft;
    }

    async function deployERC20Contract() {
        const erc20 = await ethers.deployContract("OmniwinERC20");
        await erc20.waitForDeployment();

        return erc20;
    }

    async function deployUSDCContract() {
        const usdc = await ethers.deployContract("USDC");
        await usdc.waitForDeployment();

        return usdc;
    }

    async function deployMockCCIPRouter() {
        const MockRouterClient = await ethers.deployContract("MockCCIPRouter");
        await MockRouterClient.waitForDeployment();

        return MockRouterClient;
    }

    async function deployMockLinkToken() {
        const MockLinkToken = await ethers.deployContract("MockLinkToken");
        await MockLinkToken.waitForDeployment();

        return MockLinkToken;
    }

    async function deployVrfCoordinator(MockLinkToken: any) {
        // const baseFee = 0.1 * 10 ** 18;
        const baseFee = BigInt("100000000000000000");
        //It's used to calculate the variable part of the fee for a VRF request, which depends on the amount of gas used by the callback function in your contract (the function that receives and processes the random numbers).
        const gasPriceLink = 1000000000; //1e9; //1e9 = 0.000000001 LINK per gas
        const VrfCoordinator = await ethers.deployContract("VRFCoordinatorV2Mock", [baseFee, gasPriceLink]);
        await VrfCoordinator.waitForDeployment();

        const tx = await VrfCoordinator.createSubscription();
        await tx.wait(); // Wait for the transaction to be mined

        // Fetch the transaction receipt to access the event logs
        const receipt = await ethers.provider.getTransactionReceipt(tx.hash);

        // Assuming the event is called "SubscriptionCreated" and it's the first event
        const subIdEvent = receipt?.logs.map(log => VrfCoordinator.interface.parseLog(log))
                                        .find(log => log?.name === "SubscriptionCreated");

        const subId = subIdEvent?.args.subId

        console.log("Subscription ID:", subId);
        VrfCoordinator.fundSubscription(subId, BigInt("1000000000000000000"));

        return VrfCoordinator;
    }


    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {
        const [owner, otherAccount] = await ethers.getSigners();
        const ONE_GWEI = 1_000_000_000;

        // Deploy NFT contract
        const nft = await deployNftContract();
        expect(nft).to.exist;
        console.log("NFT721 deployed to:", nft.target);

        // Deploy ERC20 contract
        const erc20 = await deployERC20Contract();
        console.log("ERC20 deployed to:", erc20.target);
        expect(erc20).to.exist;

        // Deploy USDC contract
        const usdc = await deployUSDCContract();
        console.log("USDC deployed to:", usdc.target);
        expect(usdc).to.exist;

        const MockLinkToken = await deployMockLinkToken();
        console.log("MockLinkToken deployed to:", MockLinkToken.target);
        expect(MockLinkToken).to.exist;

        // Deploy VRF Coordinator
        const vrfCoordinator = await deployVrfCoordinator(MockLinkToken);
        console.log("VRF Coordinator deployed to:", vrfCoordinator.target);
        expect(vrfCoordinator).to.exist;
  

        //mint some USDC
        const mintAmount = 1000000000;
        await usdc.mint(owner.address, mintAmount);
        const usdcBalance = await usdc.balanceOf(owner.address);
        expect(usdcBalance).to.equal(mintAmount);

        const MockRouterClient = await deployMockCCIPRouter();
        console.log("MockRouterClient deployed to:", MockRouterClient.target);
        
        const subscriptionId = BigInt(1);

        const vrfCoordinatorBNB = routerConfig.bnbChainTestnet.vrfCoordinator;
        const linkTokenBNB =  routerConfig.bnbChainTestnet.feeTokens[0];
        const keyHashBNB = routerConfig.bnbChainTestnet.keyHash;
        const mainnetBNB = false;
        const routerBNB = routerConfig.bnbChainTestnet.address;

        const omniwinMain = await ethers.deployContract("Omniwin", [vrfCoordinator, MockLinkToken, keyHashBNB, mainnetBNB, MockRouterClient.target,subscriptionId]);
        await omniwinMain.waitForDeployment();
        console.log("Main contract deployed to:", await omniwinMain.getAddress());

          //Adding the consumer contract to the subscription
        //Only owner of subscription can add consumers
        await vrfCoordinator.addConsumer(subscriptionId, omniwinMain.target);
        //fulfillrandomwords
        // await vrfCoordinator.connect(owner).fulfillRandomWords(1, omniwinMain.target);


        await omniwinMain.setUSDCTokenAddress(usdc.target);

        //check if usdc address is set
        const usdcAddressBNB = await omniwinMain.usdcContractAddress();
        expect(usdcAddressBNB).to.equal(usdc.target);

        //Deploy sidechain contract on Sepolia
        const routerSepolia = routerConfig.ethereumSepolia.address;
        const linkSepolia = routerConfig.ethereumSepolia.feeTokens[0];

        // Contracts are deployed using the first signer/account by default
        const omniwinSide = await ethers.deployContract("OmniwinSide", [MockRouterClient.target, MockLinkToken]);
        await omniwinSide.waitForDeployment();

        await omniwinSide.setUSDCTokenAddress(usdc.target);
        await omniwinSide.setMainChainSelector(routerConfig.bnbChainTestnet.chainSelector); // assuming main chain will be on bnb chain
        await omniwinSide.setMainChainRaffleAddress(omniwinMain.target);



        const omniwinSide2 = await ethers.deployContract("OmniwinSide", [MockRouterClient.target, MockLinkToken]);
        await omniwinSide2.waitForDeployment();

        await omniwinSide2.setUSDCTokenAddress(usdc.target);
        await omniwinSide2.setMainChainSelector(routerConfig.arbitrumSepolia.chainSelector);
        await omniwinSide2.setMainChainRaffleAddress(omniwinMain.target);

        //check if usdc address is set
        const usdcAddress = await omniwinSide.usdcContractAddress();
        expect(usdcAddress).to.equal(usdc.target);

        console.log("Omniwin Mainchain deployed to:", omniwinMain.target, "with owner:", owner.address);
        console.log("Omniwin Sidechain deployed to:", omniwinSide.target, "with owner:", owner.address);
        console.log("Omniwin Sidechain2 deployed to:", omniwinSide2.target, "with owner:", owner.address);

        return { omniwinMain, omniwinSide,omniwinSide2,MockLinkToken, MockRouterClient,vrfCoordinator, nft, erc20, usdc, owner, otherAccount };
    }

    it("Should mint NFT and transfer to other account", async function () {
        const { omniwinSide, nft, owner, otherAccount } = await loadFixture(deployContract);
        const tokenId = 1;
        await nft.mintCollectionNFT(owner.address, tokenId);
        expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
        await nft.transferFrom(owner.address, otherAccount.address, tokenId);
        expect(await nft.ownerOf(tokenId)).to.equal(otherAccount.address);
    })

    it("Should mint ERC20 and transfer to other account", async function () {
        const { omniwinSide, erc20, owner, otherAccount } = await loadFixture(deployContract);
        const amount = 100;
        await erc20.transfer(otherAccount.address, amount);
        expect(await erc20.balanceOf(otherAccount.address)).to.equal(amount);
    })

    describe("Raffle functionality", function () {
        it("Should create raffle on main chain with ERC20 as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];


            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );

            const raffleId = 0;
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

            //contract should own the prize
            const prizeBalance = await erc20.balanceOf(omniwinMain.target);
            expect(prizeBalance).to.equal(prizeAmount);

            //check funding list
            const funding = await omniwinMain.fundingList(raffleId)
            expect(funding.minimumFundsInWei).to.be.equal(minimumFundsInWeis);

            const contractPricesList = await omniwinMain.pricesList(raffleId,0);
            expect(contractPricesList.price).to.be.equal(prices[0].price);

            const contractPricesList1 = await omniwinMain.pricesList(raffleId,1);
            expect(contractPricesList1.price).to.be.equal(prices[1].price);
            
        });

        it("Should create raffle on main chain with ERC721 as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 1; // ERC721 token, adjust based on enum order
            const prizeAddress = nft.target; // Token contract
            const tokenId = 1; // tokenId of the NFT
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
            await nft.mintCollectionNFT(owner.address, tokenId);
            expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
            await nft.transferFrom(owner.address, otherAccount.address, tokenId);
            expect(await nft.ownerOf(tokenId)).to.equal(otherAccount.address);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
            await nft.connect(otherAccount).approve(omniwinMain.target, tokenId);

            // Check balance
            const balance = await nft.balanceOf(otherAccount.address);
            expect(balance).to.equal(1);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                tokenId,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );

            const raffleId = 0;
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);

            // contract should own the prize
            const prizeOwner = await nft.ownerOf(tokenId);
            expect(prizeOwner).to.equal(omniwinMain.target);
        });

        it("Should create raffle on main chain with ETH as prize", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 2; // ETH, adjust based on enum order
            const prizeAddress = ethers.ZeroAddress; // ETH address
            const prizeAmount = ethers.parseEther("1"); // Amount of ETH to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration,
                {
                    value: prizeAmount
                }
            );

            const raffleId = 0;
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

            // contract should own the prize
            const prizeBalance = await ethers.provider.getBalance(omniwinMain.target);
            expect(prizeBalance).to.equal(prizeAmount);

        });

        
        it("Should create a new raffle with ERC20 as prize main contract and enable raffle on sidechain", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);

            //alow source chain from sidecontract
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //allow sender from main contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);
            
            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );

            const raffleId = 0;
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
           

            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000,
                    strict: false
                }
            ];

            // Enable raffle on sidechain
            const tx2 = await omniwinMain.connect(otherAccount).enableCreateRafffleOnSidechain(raffleId, chainSelectors);

            for (let i = 0; i < chainSelectors.length; i++) {
                await expect(tx2)
                .to.emit(omniwinMain, 'CreateRaffleToSidechain')
            }

            // check if raffle is created on sidechain
            const raffle = await omniwinSide.raffles(raffleId)
            expect(raffle).to.exist;

            expect(raffle.prizeNumber).to.equal(0);
            expect(raffle.assetType).to.equal(ASSET_TYPE.CCIP); // asset type is CCIP, because the prize is held on main contract

            const priceIndex = 1;
            const pricesSidechain = await omniwinSide.pricesList(raffleId,priceIndex);
            expect(pricesSidechain.price).to.equal(prices[priceIndex].price);

        });

        it("It should fail because destination chain is not allowed", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
            
            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );

            const raffleId = 0;
            await expect(tx).to.emit(omniwinMain, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);
           

            //TODO: create raffle using enableRaffle on sidechain
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000,
                    strict: false
                }
            ]

            // Enable raffle on sidechain
            await expect(omniwinMain.connect(otherAccount).enableCreateRafffleOnSidechain(
                raffleId, chainSelectors
            )).to.be.revertedWithCustomError(omniwinMain, "DestinationChainNotAllowlisted");

        });


        it("Should fail if deadline passed maximum deadline", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 30 + 1; // 30 days

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "DeadlineExceedsMaximum");
            
        });


        it("Should fail if assetType is CCIP when called from main contract", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 3; // CCIP token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 1,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "DirectCCIPRafflesNotAllowed");
            
        });

        it("Should fail if numEntries from prices is 0", async function () {
            const { omniwinMain,omniwinSide, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 0,
                    price: ethers.parseEther("0.01"),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseEther("0.045"), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            await expect(omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            )).to.be.revertedWithCustomError(omniwinMain, "NumEntriesIsZero");
            
        });

        it("Should create raffle from sidechain", async function () {
            const { omniwinMain,omniwinSide,omniwinSide2,usdc, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
  
            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 2,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000;
            await erc20.transfer(otherAccount.address, amount);

            await erc20.connect(otherAccount).approve(omniwinSide.target, prizeAmount);

            
           
            //allow main contract to receive from source chain
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //Allow sidechain to send message to main
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            //we need to allow main contract to send back ack
            await omniwinSide.allowlistSender(omniwinMain.target, true);

            //we allow main contract to be able to send ack back to sidechain
            await omniwinMain.allowlistDestinationChain(sourceChainSelector, true);

            await omniwinSide.allowlistSourceChain(sourceChainSelector, true);

            // Call createRaffle with the defined parameters
            const tx = await omniwinSide.connect(otherAccount).CreateRaffleCCIP(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );
            
            //Emitted event to start creation of raffle on main chain
            await expect(tx).to.emit(omniwinSide, "CreateRaffleCCIPEvent")
            

            //Emitted event that raffle was created on main chain
            await expect(tx).to.emit(omniwinMain, 'RaffleCreatedFromSidechain')


            await expect(tx).to.emit(omniwinMain, 'AckRaffleCreationFromSidechain')

            //Emitted event that sidechain received ACK and raffle from sidechain was moved from tempRaffles to raffles
            await expect(tx).to.emit(omniwinSide, 'RaffleCreated')

            const raffleId = 0;
            const rafflesSide = await omniwinSide.raffles(raffleId)
            expect(rafflesSide).to.exist;

            expect(rafflesSide.prizeNumber).to.equal(prizeAmount);
        });
        // it("Should create raffle from sidechain", async function () {
        //     const { omniwinMain,omniwinSide,usdc, nft, erc20, owner, otherAccount } = this.testContext;

        //     const minimumFundsInWeis = ethers.parseEther("1");
        //     const assetType = 0; // ERC20 token, adjust based on enum order
        //     const prizeAddress = erc20.target; // Token contract
        //     const prizeAmount = 1000; // Number of tokens to be used as the prize
        //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days
        //     const chainSelectors = [routerConfig.bnbChainTestnet.chainSelector]; //create raffle on BNBTestnet also

        //     // Define prices for entries into the raffle
        //     const prices = [
        //         {
        //             id: 0,
        //             numEntries: 2,
        //             price: ethers.parseUnits("10", 6),
        //         },
        //         {
        //             id: 1,
        //             numEntries: 5,
        //             price: ethers.parseUnits("30", 6), // Slight discount for buying more
        //         },
        //     ];

        //     await erc20.connect(otherAccount).approve(omniwinSide.target, prizeAmount);
            
        //     // Call createRaffle with the defined parameters
        //     const tx = await omniwinSide.connect(otherAccount).CreateRaffleCCIP(
        //         prizeAddress,
        //         prizeAmount,
        //         minimumFundsInWeis,
        //         prices,
        //         assetType,
        //         deadlineDuration,
        //         chainSelectors
        //     );

            
        //     //Emitted event to start creation of raffle on main chain
        //     await expect(tx).to.emit(omniwinSide, "CreateRaffleCCIPEvent")

        //     //Emitted event that raffle was created on main chain
        //     await expect(tx).to.emit(omniwinMain, 'RaffleCreatedFromSidechain')

        //     //Emitted event that sidechain received ACK and raffle from sidechain was moved from tempRaffles to raffles
        //     await expect(tx).to.emit(omniwinSide, 'RaffleCreated')

        //     const raffleId = 1; //we set 1, because we already have raffle with id 0 from before
        //     const rafflesSide = await omniwinSide.raffles(raffleId)
        //     expect(rafflesSide).to.exist;

        //     expect(rafflesSide.prizeNumber).to.equal(prizeAmount);

        //     // A. Buy tickets on main chain
        //     const priceIndex = 0;
        //     const price = prices[priceIndex].price;
           
        //     //give allowance to omniwin for first buy
        //     await usdc.connect(otherAccount).approve(omniwinMain.target, price);
        //     expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price);
        //     // Buy entry type 1
            
        //     const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex, price);
        //     await buyTx1.wait();

            
        //     //check bought tickets
        //     const tickets = await omniwinMain.entriesList(raffleId,0);
        //     const currentAmountOfEntriesInTheRaffle = tickets[0];

        //     expect(currentAmountOfEntriesInTheRaffle).to.be.equal(2);
        //     expect(tickets).to.exist;

        //     // B. Buy tickets on side chain
        //     const priceIndexSide = 0;
        //     const priceSide = prices[priceIndexSide].price;

        //     //give allowance to omniwin side for first buy
        //     await usdc.connect(otherAccount).approve(omniwinSide.target, priceSide);
        //     expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(priceSide);

        //     // Buy entry type 1
        //     const buyTx1Side = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndexSide, priceSide);
        //     await buyTx1Side.wait();

        //     //check bought tickets
        //     const ticketsSide = await omniwinSide.entriesList(raffleId,0);
        //     expect(ticketsSide).to.exist;

        //     const funding = await omniwinMain.rafflesEntryInfo(raffleId)
        //     const totalFunding = price + priceSide;

        //     expect(funding[2]).to.be.equal(totalFunding);
        // });
    });

    describe("Raffle Tickets functionality", function () {
        beforeEach(async function () {
            // Load the initial setup fixture
            const { omniwinMain,omniwinSide,usdc, nft, erc20, owner, otherAccount ,MockRouterClient} = await loadFixture(deployContract);

            //Create raffle on main chain and on secondary chains (chainSelectors)
  
            const minimumFundsInWeis = ethers.parseEther("1");
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 1000; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain - allow messages from main chain to be sent only to BNBTestnet
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);

            //alow source chain from sidecontract. We allow to receive messages from main chain (sourceChainSelector)
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            //allow sender from main contract. We allow main contract (the address) to send messages to side contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);


            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup

            await omniwinMain.allowlistSender(omniwinSide.target, true);

            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 100 * 10 ** 6;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 2,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );


            //enable raffle on sidechain
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 300_000,
                    strict: false
                }
            ];

            // Enable raffle on sidechain
            const tx2 = await omniwinMain.connect(otherAccount).enableCreateRafffleOnSidechain(0, chainSelectors);

            
            // Extend this object with more properties as needed by tests
            this.testContext = { omniwinMain, omniwinSide,usdc, erc20, otherAccount };
        });

        it("Should allow buying tickets on main chain", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount } = this.testContext;
            const raffleId = 0;
            const priceIndex = 0;
            const prices = await omniwinMain.pricesList(raffleId, priceIndex);
            const price = prices.price;
            
            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            
            // A. Buy tickets on main chain
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price);

            // Buy entry type 1
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex, price);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2, price2);
            await buyTx2.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);
            expect(tickets).to.exist;

            const funding = await omniwinMain.rafflesEntryInfo(raffleId);

            const totalFunding = price + price2;

            expect(funding[2]).to.be.equal(totalFunding);

        });

        it("Should allow buying tickets on both main and side chains", async function () {
            const { omniwinMain,usdc, omniwinSide, erc20, otherAccount } = this.testContext;
            const raffleId = 0;
            const priceIndex = 0;
            const prices = await omniwinMain.pricesList(raffleId, priceIndex);
            const price = prices.price;
            
            //mint some USDC
            const mintAmount = ethers.parseUnits("2000", 6);
            await usdc.mint(otherAccount, mintAmount);
            
            // A. Buy tickets on main chain
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price);

            // Buy entry type 1
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex, price);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2, price2);
            await buyTx2.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);
            expect(tickets).to.exist;

            // B. Buy tickets on side chain
            
            //give allowance to omniwin side for first buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, price);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(price);

            // Buy entry type 1
            const buyTx1Side = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex, price);
            await buyTx1Side.wait();


            const funding = await omniwinMain.rafflesEntryInfo(raffleId)
            const totalFunding = price + price + price2;

            expect(funding[2]).to.be.equal(totalFunding);
        });

    });




    // it("Should claim full refund for all bought tickets", async function () {
    //     const { omniwin, nft, erc20, owner, usdc, otherAccount } = await loadFixture(deployContract);

    //     const raffleId = 0;
    //     const minimumFundsInWeis = ethers.parseEther("100");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 0; // ERC20 token, adjust based on enum order
    //     const prizeAddress = erc20.target; // Token contract
    //     const prizeAmount = 1000; // Number of tokens to be used as the prize
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Transfer tokens to `otherAccount` to be used as the prize
    //     const amount = 10000;
    //     await erc20.transfer(otherAccount.address, amount);

    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
    //     await erc20.connect(otherAccount).approve(omniwin.target, prizeAmount);

    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             numEntries: 1,
    //             price: ethers.parseUnits("10", 6), // Convert $10 to smallest unit as BigInt
    //         },
    //         {
    //             numEntries: 5,
    //             price: ethers.parseUnits("100", 6), // Convert $100 to smallest unit as BigInt
    //         },
    //         {
    //             numEntries: 250,
    //             price: ethers.parseUnits("1000", 6), // Convert $1000 to smallest unit as BigInt
    //         },
    //     ];
    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         prizeAmount,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     //mint some USDC
    //     const mintAmount = ethers.parseUnits("2000", 6);
    //     await usdc.mint(otherAccount, mintAmount);

    //     const initialBalance = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(initialBalance).to.be.equal(mintAmount);

    //     //give allowance to omniwin
    //     await usdc.connect(otherAccount).approve(omniwin.target, mintAmount);
    //     expect(await usdc.allowance(otherAccount.address, omniwin.target)).to.be.equal(mintAmount);

    //     // Buy entry type 1 (single entry)
    //     const buyTx1 = await omniwin.connect(otherAccount).buyEntry(raffleId, 0, prices[0].price);
    //     await buyTx1.wait();

    //     // Buy entry type 2 (multiple entries)
    //     const buyTx2 = await omniwin.connect(otherAccount).buyEntry(raffleId, 2, prices[2].price);
    //     await buyTx2.wait();


    //     //check bought tickets
    //     const tickets = await omniwin.getRafflesEntryInfo(raffleId);
    //     expect(tickets).to.exist;

    //     // Wait for the deadline to pass
    //     await time.increase(deadlineDuration + 1);

    //     //check usdc balance of otherAccount
    //     const balanceAfterTicketBuy = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(balanceAfterTicketBuy).to.be.equal(initialBalance - prices[0].price - prices[2].price);

    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, prizeAmount, assetType);

    //     const totalTicketCost = prices[0].price + prices[2].price;

    //     const expectedBalanceAfterRefund = balanceAfterTicketBuy + totalTicketCost;

    //     // // claim refund
    //     await omniwin.connect(otherAccount).claimRefund(raffleId)
    //     const balanceAfterRefund = await usdc.connect(otherAccount).balanceOf(otherAccount.address);

    //     expect(balanceAfterRefund).to.be.equal(expectedBalanceAfterRefund);
    // });


    // it("Should create raffle with ERC721 as prize", async function () {
    //     const { omniwin, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

    //     const minimumFundsInWeis = ethers.parseEther("1");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 1; // ERC721 token, adjust based on enum order
    //     const prizeAddress = nft.target; // Token contract
    //     const tokenId = 1; // tokenId of the NFT
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
    //     await nft.mintCollectionNFT(owner.address, tokenId);
    //     expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    //     await nft.transferFrom(owner.address, otherAccount.address, tokenId);


    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
    //     await nft.connect(otherAccount).approve(omniwin.target, tokenId);

    //     // Check balance
    //     const balance = await nft.balanceOf(otherAccount.address);
    //     expect(balance).to.equal(1);

    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             id: 0,
    //             numEntries: 1,
    //             price: ethers.parseUnits("10", 6),
    //         },
    //         {
    //             id: 1,
    //             numEntries: 5,
    //             price: ethers.parseUnits("100", 6), // Slight discount for buying more
    //         },
    //     ];

    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         tokenId,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     const raffleId = 0;
    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);
    // })

    // it("Should claim full refund for all bought tickets and nft reclaim", async function () {
    //     const { omniwin, nft, erc20, usdc, owner, otherAccount } = await loadFixture(deployContract);

    //     const raffleId = 0;
    //     const minimumFundsInWeis = ethers.parseEther("100");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 1; // ERC721 token, adjust based on enum order
    //     const prizeAddress = nft.target; // Token contract
    //     const tokenId = 1; // tokenId of the NFT
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
    //     await nft.mintCollectionNFT(owner.address, tokenId);
    //     expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    //     await nft.transferFrom(owner.address, otherAccount.address, tokenId);

    //     //check nft balance of otherAccount
    //     const balanceAfterNftTransfer = await nft.balanceOf(otherAccount.address);
    //     expect(balanceAfterNftTransfer).to.equal(1);

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId).to.equal(otherAccount.address);

    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its nft
    //     await nft.connect(otherAccount).approve(omniwin.target, tokenId);

    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             numEntries: 1,
    //             price: ethers.parseUnits("10", 6),
    //         },
    //         {
    //             numEntries: 5,
    //             price: ethers.parseUnits("100", 6), // Slight discount for buying more
    //         },
    //         {
    //             numEntries: 250,
    //             price: ethers.parseUnits("1000", 6), // Slight discount for buying more
    //         },
    //     ];

    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         tokenId,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId2 = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId2).to.equal(omniwin.target);

    //     const nftBalanceAfterRaffleCreation = await nft.balanceOf(otherAccount.address);
    //     expect(nftBalanceAfterRaffleCreation).to.equal(0);

    //     //mint some USDC
    //     const mintAmount = ethers.parseUnits("2000", 6);
    //     await usdc.mint(otherAccount, mintAmount);

    //     const initialBalance = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(initialBalance).to.be.equal(mintAmount);

    //     //give allowance to omniwin
    //     await usdc.connect(otherAccount).approve(omniwin.target, mintAmount);
    //     expect(await usdc.allowance(otherAccount.address, omniwin.target)).to.be.equal(mintAmount);

    //     // Buy entry type 1
    //     await omniwin.connect(otherAccount).buyEntry(raffleId, 0, prices[0].price);

    //     // Buy entry type 2
    //     await omniwin.connect(otherAccount).buyEntry(raffleId, 2, prices[2].price);

    //     //check bought tickets
    //     const tickets = await omniwin.getRafflesEntryInfo(raffleId);
    //     expect(tickets).to.exist;

    //     // Wait for the deadline to pass
    //     await time.increase(deadlineDuration + 1);

    //     //check usdc balance of otherAccount
    //     const balanceAfterTicketBuy = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(balanceAfterTicketBuy).to.be.equal(initialBalance - prices[0].price - prices[2].price);

    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);

    //     const totalTicketCost = prices[0].price + prices[2].price;

    //     const expectedBalanceAfterRefund = balanceAfterTicketBuy + totalTicketCost;

    //     // claim refund for all tickets
    //     await omniwin.connect(otherAccount).claimRefund(raffleId)

    //     const balanceAfterRefund = await usdc.connect(otherAccount).balanceOf(otherAccount.address);
    //     expect(balanceAfterRefund).to.be.equal(expectedBalanceAfterRefund);

    //     //reclaim nft
    //     await omniwin.connect(otherAccount).reclaimAssets(raffleId)

    //     // Check NFT balance after reclaiming
    //     const finalNftBalance = await nft.balanceOf(otherAccount.address);
    //     expect(finalNftBalance).to.equal(1);

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId3 = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId3).to.equal(otherAccount.address);

    // });


    // it("Should cancel raffle", async function () {
    //     const { omniwin, nft, erc20, owner, otherAccount } = await loadFixture(deployContract);

    //     const minimumFundsInWeis = ethers.parseEther("1");
    //     const entryType = 0; // Assuming 0 represents a specific entry type, adjust based on your enum
    //     const assetType = 1; // ERC721 token, adjust based on enum order
    //     const prizeAddress = nft.target; // Token contract
    //     const tokenId = 1; // tokenId of the NFT
    //     const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

    //     // Step 1: Mint ERC721 token and transfer to `otherAccount` to be used as the prize
    //     await nft.mintCollectionNFT(owner.address, tokenId);
    //     expect(await nft.ownerOf(tokenId)).to.equal(owner.address);
    //     await nft.transferFrom(owner.address, otherAccount.address, tokenId);


    //     // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
    //     await nft.connect(otherAccount).approve(omniwin.target, tokenId);

    //     // Check balance
    //     const balance = await nft.balanceOf(otherAccount.address);
    //     expect(balance).to.equal(1);

    //     // Define prices for entries into the raffle
    //     const prices = [
    //         {
    //             id: 0,
    //             numEntries: 1,
    //             price: ethers.parseEther("0.01"),
    //         },
    //         {
    //             id: 1,
    //             numEntries: 5,
    //             price: ethers.parseEther("0.045"), // Slight discount for buying more
    //         },
    //     ];

    //     // Call createRaffle with the defined parameters
    //     const tx = await omniwin.connect(otherAccount).createRaffle(
    //         prizeAddress,
    //         tokenId,
    //         minimumFundsInWeis,
    //         prices,
    //         entryType,
    //         assetType,
    //         deadlineDuration
    //     );

    //     const raffleId = 0;
    //     await expect(tx).to.emit(omniwin, "RaffleStarted").withArgs(raffleId, prizeAddress, tokenId, assetType);

    //     //cancel raffle
    //     await omniwin.cancelRaffle(raffleId);

    //     // Check ownership of the NFT with tokenId
    //     const ownerOfTokenId = await nft.ownerOf(tokenId);
    //     expect(ownerOfTokenId).to.equal(otherAccount.address);
    // });

    describe("Raffle vrf", function () {
        beforeEach(async function () {
            // Load the initial setup fixture
            const { omniwinMain,omniwinSide, omniwinSide2, usdc, nft, erc20, owner, otherAccount,MockLinkToken ,MockRouterClient,vrfCoordinator} = await loadFixture(deployContract);

            const minimumFundsInWeis = ethers.parseUnits("3", 6);
            const assetType = 0; // ERC20 token, adjust based on enum order
            const prizeAddress = erc20.target; // Token contract
            const prizeAmount = 100; // Number of tokens to be used as the prize
            const deadlineDuration = 60 * 60 * 24 * 7; // 7 days

            //allow destination chain - allow messages from main chain to be sent only to BNBTestnet
            await omniwinMain.allowlistDestinationChain(routerConfig.bnbChainTestnet.chainSelector, true);
            await omniwinMain.allowlistDestinationChain(routerConfig.polygonMumbai.chainSelector, true);

            //alow source chain from sidecontract. We allow to receive messages from main chain (sourceChainSelector)
            const sourceChainSelector = routerConfig.ethereumSepolia.chainSelector;
            await omniwinSide.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup
            //allow sender from main contract. We allow main contract (the address) to send messages to side contract
            await omniwinSide.allowlistSender(omniwinMain.target, true);
            await omniwinMain.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup
            await omniwinMain.allowlistSender(omniwinSide.target, true);

            await omniwinSide2.allowlistSourceChain(sourceChainSelector, true); //sepolia chainSelector cuz its hardcoded in the mockup
            //allow sender from main contract. We allow main contract (the address) to send messages to side contract
            await omniwinSide2.allowlistSender(omniwinMain.target, true);
            await omniwinMain.allowlistSender(omniwinSide2.target, true);

            //mint some USDC
            const mintAmount = ethers.parseUnits("10000", 6);
            await usdc.mint(otherAccount, mintAmount);

            //mint some Link
            const linkAmount = ethers.parseUnits("10000", 18);
            await MockLinkToken.transfer(omniwinMain.target, linkAmount);
            
            // Step 1: Transfer tokens to `otherAccount` to be used as the prize
            const amount = 10000 * 10 ** 6;
            await erc20.transfer(otherAccount.address, amount);

            // Step 2: `otherAccount` approves `omniwin` contract to spend its tokens
            await erc20.connect(otherAccount).approve(omniwinMain.target, prizeAmount);

            // Check allowance
            const allowance = await erc20.allowance(otherAccount.address, omniwinMain.target);
            expect(allowance).to.equal(prizeAmount);

            // Check balance
            const balance = await erc20.balanceOf(otherAccount.address);
            expect(balance).to.equal(amount);

            // Define prices for entries into the raffle
            const prices = [
                {
                    id: 0,
                    numEntries: 2,
                    price: ethers.parseUnits("10", 6),
                },
                {
                    id: 1,
                    numEntries: 5,
                    price: ethers.parseUnits("30", 6), // Slight discount for buying more
                },
            ];

            // Call createRaffle with the defined parameters
            const tx = await omniwinMain.connect(otherAccount).createRaffle(
                prizeAddress,
                prizeAmount,
                minimumFundsInWeis,
                prices,
                assetType,
                deadlineDuration
            );


            //enable raffle on sidechain
            const chainSelectors = [
                {
                    ccnsReceiverAddress: omniwinSide.target, // This should be an Ethereum address
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 350_000,
                    strict: false
                },
                {
                    ccnsReceiverAddress: omniwinSide2.target, // This should be an Ethereum address
                    chainSelector: routerConfig.polygonMumbai.chainSelector, // This should be a numerical chain identifier
                    gasLimit: 350_000,
                    strict: false
                }
            ];

            const gasLimit = chainSelectors.map((chain) => chain.gasLimit).reduce((a, b) => a + b, 0);

            // Enable raffle on sidechain
            const tx2 = await omniwinMain.connect(otherAccount).enableCreateRafffleOnSidechain(0, chainSelectors, { gasLimit: gasLimit });


            const raffleId = 0
            const priceIndex = 0;
              // A. Buy tickets on main chain
            //give allowance to omniwin for first buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, prices[priceIndex].price);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(prices[priceIndex].price);

            // Buy entry type 1
            const buyTx1 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex, prices[priceIndex].price);
            await buyTx1.wait();

            // Buy entry type 2
            const priceIndex2 = 1;
            const prices2 = await omniwinMain.pricesList(raffleId, priceIndex2);
            const price2 = prices2.price;

            //give allowance to omniwin for second buy
            await usdc.connect(otherAccount).approve(omniwinMain.target, price2);
            expect(await usdc.allowance(otherAccount.address, omniwinMain.target)).to.be.equal(price2);

            const buyTx2 = await omniwinMain.connect(otherAccount).buyEntry(raffleId, priceIndex2, price2);
            await buyTx2.wait();

            //check bought tickets
            const tickets = await omniwinMain.entriesList(raffleId,1);
            expect(tickets).to.exist;

            // B. Buy tickets on side chain
            //give allowance to omniwin side for first buy
            await usdc.connect(otherAccount).approve(omniwinSide.target, prices[priceIndex].price);
            expect(await usdc.allowance(otherAccount.address, omniwinSide.target)).to.be.equal(prices[priceIndex].price);

            // Buy entry type 1
            const buyTx1Side = await omniwinSide.connect(otherAccount).buyEntry(raffleId, priceIndex, prices[priceIndex].price);
            await buyTx1Side.wait();




             // C. Buy tickets on side chain 2
            //give allowance to omniwin side for first buy
            await usdc.connect(otherAccount).approve(omniwinSide2.target, prices[priceIndex].price);
            expect(await usdc.allowance(otherAccount.address, omniwinSide2.target)).to.be.equal(prices[priceIndex].price);

            // Buy entry type 1
            const buyTx2Side = await omniwinSide2.connect(otherAccount).buyEntry(raffleId, priceIndex, prices[priceIndex].price);
            await buyTx2Side.wait();


            const funding = await omniwinMain.rafflesEntryInfo(raffleId)
            const totalFunding = prices[priceIndex].price + prices[priceIndex].price + price2 + prices[priceIndex].price;

            expect(funding[2]).to.be.equal(totalFunding);
            
            // Extend this object with more properties as needed by tests
            this.testContext = { omniwinMain, omniwinSide, omniwinSide2,usdc, erc20, otherAccount,vrfCoordinator };
        });

        it("Pick a winner", async function () {
            const { omniwinMain, omniwinSide,usdc, erc20, otherAccount,vrfCoordinator } = this.testContext;
            const raffleId = 0;

            console.log("account: ",otherAccount.address);
            console.log("omniwinMain: ",omniwinMain.target);

            //set winner
            const callbackGasLimit = 300_000;
            const requestConfirmations = 10;
            const randomness = 1;
            const tx = await omniwinMain.setWinner(raffleId, callbackGasLimit, requestConfirmations, randomness);

            //check for event
            const amountRaised = (await omniwinMain.rafflesEntryInfo(raffleId))[2];
            console.log("Usd raised: ",BigInt(amountRaised)/BigInt(10**6));

            await expect(tx).to.emit(omniwinMain, "SetWinnerTriggered").withArgs(raffleId, amountRaised);

            //manually call fulfillRandomWords (on mainnet chainlink will do this)
            const requestId = 1;
            await vrfCoordinator.fulfillRandomWords(requestId,omniwinMain.target)


            //we send all supported chains, and let the contract check it should send messages to them
            const allSupportedChains = [
                {
                    ccnsReceiverAddress: omniwinSide.target,
                    gasLimit: 500_000,
                    strict: false,
                    chainSelector: routerConfig.bnbChainTestnet.chainSelector
                }
            ] 
            //After fulfillRandomWords has been called => winner has been set in the raffle
            const tx2 = await omniwinMain.sendPrizeDistributionMessages(raffleId, allSupportedChains)
            await expect(tx2).to.emit(omniwinMain, "FeeTransferredToPlatform")

            for(let chain of allSupportedChains){
                await expect(tx2).to.emit(omniwinMain, "PrizeDistributionToSidechain")
            }



            const fundingList = await omniwinMain.fundingList(raffleId);
            expect(fundingList.platformFeeCollected).to.be.equal(true);

            //FeeTransferredToPlatform

            //check if winner has been set
            const winner = await omniwinMain.raffles(raffleId);
            expect(winner.winner).to.be.equal(otherAccount.address);

            //claim raised money on main chain
            await omniwinMain.connect(otherAccount).claimCash(raffleId);

            const winnerBalanceBefore = await erc20.balanceOf(otherAccount.address);
            //winner claim prize
            await omniwinMain.connect(otherAccount).claimPrize(raffleId);
            //expect winner to hold the prize
            const winnerBalanceAfterClaim = await erc20.balanceOf(otherAccount.address);
            expect(winnerBalanceAfterClaim).to.be.equal(winnerBalanceBefore + BigInt(100));
        });
    });
});