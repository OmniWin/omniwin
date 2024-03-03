import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Omniwin", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployContract() {
        const ONE_GWEI = 1_000_000_000;

        //Sepolia
        const vrfCoordinator = "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625";
        const keyHash = "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c";
        const linkContract = "0x779877A7B0D9E8603169DdbD7836e478b4624789";
        const mainnet = false;

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const Omniwin = await ethers.getContractFactory("Omniwin");
        // const omniwin = await Omniwin.deploy(vrfCoordinator, keyHash, linkContract, mainnet, { value: ONE_GWEI });
        const omniwin = await Omniwin.deploy(vrfCoordinator, keyHash, linkContract, mainnet);

        return { omniwin, owner, otherAccount };
    }

    it("Should deploy the contract", async function () {
        await loadFixture(deployContract);
    });

});
