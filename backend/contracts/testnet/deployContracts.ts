//npx ts-node deployContracts.ts 

import { exec } from "child_process";
import secrets from "../secrets.json" ;
import config from "./config.json"
import {
  routerConfig,
  LINK_ADDRESSES,
  RouterConfig,
} from "../constants/constants";
import { generateArgsMain } from "./argsMainGenerator";
import { generateArgsSide } from "./argsSideGenerator";
import fs from "fs";

function runCommand(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(stderr);
      }

      resolve(stdout.trim());
    });
  });
}

async function main() {
  try {
    const MAIN_CHAIN = "bnbChainTestnet";
    const SIDE_CHAIN = "baseTestnet";//ethereumSepolia
    const MAIN_CHAIN_SELECTOR = routerConfig[MAIN_CHAIN].chainSelector;
    const SIDE_CHAIN_SELECTOR = routerConfig[SIDE_CHAIN].chainSelector;
    const NFT_BASE_URI = "https://api.omniwin.io/v1/nft/"

    // const { MAIN_CONTRACT, USDC_MAIN_CONTRACT } = await deployMain(MAIN_CHAIN,NFT_BASE_URI) as { MAIN_CONTRACT: string, USDC_MAIN_CONTRACT: string };
  
    // const { MAIN_CONTRACT, USDC_MAIN_CONTRACT } = { 
    //   MAIN_CONTRACT: "0xEb0Af68e467B2F2E68Aa9995DDAA2ef300c85D94",
    //   USDC_MAIN_CONTRACT: "0x6df41902C6aD6C9ebBd655eB55C19A777ae69c37"
    // }

    // const { SIDE_CONTRACT, USDC_CONTRACT_SIDE } =
    //   await deploySide(SIDE_CHAIN,NFT_BASE_URI) as { SIDE_CONTRACT: string, USDC_CONTRACT_SIDE: string };
    
    // const { SIDE_CONTRACT, USDC_CONTRACT_SIDE } = {
    //   SIDE_CONTRACT: "0x1304a1Aa1BCf40A560A2422391062451f2fE5bBC",
    //   USDC_CONTRACT_SIDE: "0x32E33b084f2AB60FC77Fc75bdEA21c21F2143737"
    // }

    
    await deployNft(MAIN_CHAIN, NFT_BASE_URI);
    await deployNft(SIDE_CHAIN, NFT_BASE_URI);
    // const tokenId = await mintNft(MAIN_CHAIN, config[MAIN_CHAIN + "NftContract"], secrets[MAIN_CHAIN + "Address" as keyof typeof secrets]);

    // addContractToConfig(
    //   {
    //     [MAIN_CHAIN]: {
    //       "Contract": MAIN_CONTRACT,
    //       "UsdcContract": USDC_MAIN_CONTRACT,
    //       "NftContract": NFT_MAIN_CONTRACT
    //     },
    //     [SIDE_CHAIN]: {
    //       "Contract": SIDE_CONTRACT,
    //       "UsdcContract": USDC_CONTRACT_SIDE,
    //       "NftContract": NFT_SIDE_CONTRACT
    //     }
    //   }
    // );


    // await setupSecurity(
    //   MAIN_CONTRACT,
    //   SIDE_CONTRACT,
    //   MAIN_CHAIN,
    //   SIDE_CHAIN,
    //   MAIN_CHAIN_SELECTOR,
    //   SIDE_CHAIN_SELECTOR
    // );

    // await mintUSDC(MAIN_CHAIN, USDC_MAIN_CONTRACT, 1000, secrets[MAIN_CHAIN + "Address"  as keyof typeof secrets]);
    // await mintUSDC(SIDE_CHAIN, USDC_CONTRACT_SIDE, 1000, secrets[SIDE_CHAIN + "Address"   as keyof typeof secrets]);


    // await addLinkToken(MAIN_CHAIN, config[MAIN_CHAIN + "Contract"], 1);
    // await addLinkToken(SIDE_CHAIN, config[SIDE_CHAIN + "Contract"], 1);

    // console.log("MAIN_CONTRACT", MAIN_CONTRACT);
    // console.log("USDC_CONTRACT", USDC_MAIN_CONTRACT);

    // console.log("SIDE_CONTRACT", SIDE_CONTRACT);
    // console.log("USDC_CONTRACT", USDC_CONTRACT_SIDE);

    // console.log("Contracts deployed successfully!");
  } catch (error) {
    console.error("Deployment script failed:", error);
  }
}

async function deployNft(network: string, NFT_BASE_URI: string = "https://api.omniwin.io/v1/nft/"){
  const nftContract = await runCommand(
    `npx hardhat deployNft --network ${network}`
  ) as string;

  await runCommand(
    `npx hardhat verify ${nftContract} --network ${network}`
  );

  //Set base uri
  await runCommand(
    `npx hardhat setBaseURI --network ${network} --contract ${nftContract} --uri ${NFT_BASE_URI}`
  );

  console.log("NFT Contract deployed:", nftContract);

  return nftContract;
}

function addContractToConfig(data: {[network: string]: {Contract: string, UsdcContract: string}}) {
  console.log("Adding contract to config...");
  for(const [network, contractObj] of Object.entries(data)) {
    for(const [type, contract] of Object.entries(contractObj)) {
        config[network + type] = contract;
    }
  }
  
  fs.writeFileSync(
    "/home/spike/omniwin/backend/contracts/testnet/config.json",
    JSON.stringify(config, null, 2)
  );

  console.log("Contract added to config!");
}

async function mintUSDC(chain: string, contract: string, amount: number, to: string) {
  const AMOUNT = amount * 10 ** 6;
  await runCommand(
    `npx hardhat mintUSDC --network ${chain} --contract ${contract} --amount ${AMOUNT} --to ${to}`
  );
}

async function mintNft(chain: string, contract: string, to: string) {
  const tokenId = await runCommand(
    `npx hardhat mintNft --network ${chain} --contract ${contract} --to ${to}`
  );

  return tokenId;
}

async function addLinkToken(chain: string, contract: string, amount: number) {
  //Add link token from my address to the contract
  await runCommand(
    `npx hardhat addLinkToken --network ${chain} --to ${contract} --amount ${amount}`
  );
}

async function deployMain(mainNetwork: string, NFT_BASE_URI: string = "https://api.omniwin.io/v1/nft/") {
  const ADDRESS_MAIN = secrets[mainNetwork + "Address" as keyof typeof secrets];
  const MAIN_NETWORK = mainNetwork;

  generateArgsMain({
    vrfCoordinator:routerConfig.bnbChainTestnet.vrfCoordinator,
    linkToken: LINK_ADDRESSES.bnbChainTestnet,
    keyHash: routerConfig.bnbChainTestnet.keyHash,
    mainnetFee: false,
    router: routerConfig.bnbChainTestnet.address,
    subscriptionId: 3506
  });

  console.log(`Deploying main contract on ${MAIN_NETWORK}...`);
  const MAIN_CONTRACT = await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat run deployMain.ts --network ${MAIN_NETWORK}`
  );
  console.log(`Deployed Contract Address: ${MAIN_CONTRACT}`);

  console.log(`Verifying contract on ${MAIN_NETWORK}...`);
  await runCommand(
    `npx hardhat verify --constructor-args argsMain.js ${MAIN_CONTRACT} --network ${MAIN_NETWORK}`
  );

  console.log(`Deploying USDC contract on ${MAIN_NETWORK}...`);
  const USDC_MAIN_CONTRACT = await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat deployUSDC --network ${MAIN_NETWORK}`
  ) as string;

  console.log(`Setting USDC contract on main contract...`);
  await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat setUSDC --network ${MAIN_NETWORK} --contract ${MAIN_CONTRACT} --usdc ${USDC_MAIN_CONTRACT}`
  );

  const NFT_MAIN_CONTRACT = await deployNft(mainNetwork,NFT_BASE_URI);

  return {
    MAIN_CONTRACT,
    USDC_MAIN_CONTRACT,
    NFT_MAIN_CONTRACT
  };
}

async function deploySide(sideNetwork: string, NFT_BASE_URI: string = "https://api.omniwin.io/v1/nft/") {
  const ADDRESS_SIDE = secrets[sideNetwork + "Address" as keyof typeof secrets];
  const SIDE_NETWORK = sideNetwork;

  generateArgsSide({
    linkToken: LINK_ADDRESSES.ethereumSepolia,
    router: routerConfig.ethereumSepolia.address,
  });

  console.log(`Deploying side contract on ${SIDE_NETWORK}, using wallet ${ADDRESS_SIDE}...`);
  const SIDE_CONTRACT = await runCommand(
    `npx hardhat deploySide --network ${SIDE_NETWORK}`
  );
  console.log(`Deployed Contract Address: ${SIDE_CONTRACT}`);

  console.log(`Verifying contract on ${SIDE_NETWORK}...`);
  await runCommand(
    `npx hardhat verify --constructor-args argsSide.js ${SIDE_CONTRACT} --network ${SIDE_NETWORK}`
  );

  console.log(`Deploying USDC contract on ${SIDE_NETWORK}...`);
  const USDC_CONTRACT_SIDE = await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat deployUSDC --network ${SIDE_NETWORK}`
  );

  console.log(`Setting USDC contract on side contract...`);
  await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat setUSDC --network ${SIDE_NETWORK} --contract ${SIDE_CONTRACT} --usdc ${USDC_CONTRACT_SIDE}`
  );

  const NFT_SIDE_CONTRACT = await deployNft(sideNetwork,NFT_BASE_URI);

  return {
    SIDE_CONTRACT,
    USDC_CONTRACT_SIDE,
    NFT_SIDE_CONTRACT
  };
}

async function setupSecurity(
  MAIN_CONTRACT: string,
  SIDE_CONTRACT: string,
  MAIN_CHAIN: string,
  SIDE_CHAIN: string,
  MAIN_CHAIN_SELECTOR: string,
  SIDE_CHAIN_SELECTOR: string
) {
  //Security setup
  console.log("Setting up security...");

  console.log("Setting main chain raffle to sidechain...");
  await runCommand(
    `npx hardhat setMainChainRaffleToSidechain --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --raffle ${MAIN_CONTRACT}`
  );

  console.log("Setting main chain selector to sidechain...");
  await runCommand(
    `npx hardhat setMainChainSelectorToSidechain --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --selector ${MAIN_CHAIN_SELECTOR}`
  );

  console.log("Setting side chain selector to mainchain...");
  await runCommand(
    `npx hardhat allowDestinationChain --network ${MAIN_CHAIN} --contract ${MAIN_CONTRACT} --selector ${SIDE_CHAIN_SELECTOR} --allow true`
  );

  console.log("Setting main chain selector to sidechain...");
  await runCommand(
    `npx hardhat allowlistSourceChain --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --selector ${MAIN_CHAIN_SELECTOR} --allow true`
  );

  console.log("Setting main contract to side chain...");
  await runCommand(
    `npx hardhat allowlistSender --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --externalcontract ${MAIN_CONTRACT} --allow true`
  );

  console.log("Setting side chain selector to mainchain...");
  await runCommand(
    `npx hardhat allowlistSourceChain --network ${MAIN_CHAIN} --contract ${MAIN_CONTRACT} --selector ${SIDE_CHAIN_SELECTOR} --allow true`
  );

  console.log("Setting side contract to main chain...");
  await runCommand(
    `npx hardhat allowlistSender --network ${MAIN_CHAIN} --contract ${MAIN_CONTRACT} --externalcontract ${SIDE_CONTRACT} --allow true`
  );
}

main();
