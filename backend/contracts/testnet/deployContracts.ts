import { exec } from "child_process";
import secrets from "../secrets.json" ;
import {
  routerConfig,
  LINK_ADDRESSES,
  RouterConfig,
} from "../constants/constants.js";

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
    const SIDE_CHAIN = "ethereumSepolia";
    const MAIN_CHAIN_SELECTOR = routerConfig[MAIN_CHAIN].chainSelector;
    const SIDE_CHAIN_SELECTOR = routerConfig[SIDE_CHAIN].chainSelector;

    const { MAIN_CONTRACT, USDC_CONTRACT } = await deployMain(MAIN_CHAIN) as { MAIN_CONTRACT: string, USDC_CONTRACT: string };

    const { SIDE_CONTRACT, USDC_CONTRACT: USDC_CONTRACT_SIDE } =
      await deploySide(SIDE_CHAIN) as { SIDE_CONTRACT: string, USDC_CONTRACT: string };

    await setupSecurity(
      MAIN_CONTRACT,
      SIDE_CONTRACT,
      MAIN_CHAIN,
      SIDE_CHAIN,
      MAIN_CHAIN_SELECTOR,
      SIDE_CHAIN_SELECTOR
    );

    await mintUSDC(MAIN_CHAIN, USDC_CONTRACT, 1000, secrets[MAIN_CHAIN + "Address"  as keyof typeof secrets]);
    await mintUSDC(SIDE_CHAIN, USDC_CONTRACT_SIDE, 1000, secrets[SIDE_CHAIN + "Address"   as keyof typeof secrets]);

    await addLinkToken(MAIN_CHAIN, MAIN_CONTRACT, 1);
    await addLinkToken(SIDE_CHAIN, SIDE_CONTRACT, 1);

    console.log("Contracts deployed successfully!");
  } catch (error) {
    console.error("Deployment script failed:", error);
  }
}

async function mintUSDC(chain: string, contract: string, amount: number, to: string) {
  const AMOUNT = amount * 10 ** 6;
  await runCommand(
    `npx hardhat mintUSDC --network ${chain} --contract ${contract} --amount ${AMOUNT} --to ${to}`
  );
}

async function addLinkToken(chain: string, contract: string, amount: number) {
  await runCommand(
    `npx hardhat addLinkToken --network ${chain} --to ${contract} --amount ${amount}`
  );
}

async function deployMain(mainNetwork: string) {
  const ADDRESS_MAIN = secrets[mainNetwork + "Address" as keyof typeof secrets];
  const MAIN_NETWORK = mainNetwork;

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
  const USDC_CONTRACT = await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat run deployUSDC.ts --network ${MAIN_NETWORK}`
  ) as string;

  console.log(`Setting USDC contract on main contract...`);
  await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat run setUSDC.ts --network ${MAIN_NETWORK} --contract ${MAIN_CONTRACT} --usdc ${USDC_CONTRACT}`
  );

  console.log(`Mint USDC tokens to ${MAIN_NETWORK}...`);
  await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat run mintUSDC.ts --network ${MAIN_NETWORK} --contract ${USDC_CONTRACT} --to ${ADDRESS_MAIN}`
  ) as string;

  return {
    MAIN_CONTRACT,
    USDC_CONTRACT,
  };
}

async function deploySide(sideNetwork: string) {
  const ADDRESS_SIDE = secrets[sideNetwork + "Address" as keyof typeof secrets];
  const SIDE_NETWORK = sideNetwork;

  console.log(`Deploying side contract on ${SIDE_NETWORK}...`);
  const SIDE_CONTRACT = await runCommand(
    `npx hardhat deploySide --network ${SIDE_NETWORK}`
  );
  console.log(`Deployed Contract Address: ${SIDE_CONTRACT}`);

  console.log(`Verifying contract on ${SIDE_NETWORK}...`);
  await runCommand(
    `npx hardhat verify --constructor-args argsSide.js ${SIDE_CONTRACT} --network ${SIDE_NETWORK}`
  );

  console.log(`Deploying USDC contract on ${SIDE_NETWORK}...`);
  const USDC_CONTRACT = await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat run deployUSDC.ts --network ${SIDE_NETWORK}`
  );

  console.log(`Setting USDC contract on side contract...`);
  await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat run setUSDC.ts --network ${SIDE_NETWORK} --contract ${SIDE_CONTRACT} --usdc ${USDC_CONTRACT}`
  );

  console.log(`Mint USDC tokens to ${SIDE_NETWORK}...`);
  await runCommand(
    `cd /home/spike/omniwin/backend/contracts/scripts/Deploy; npx hardhat run mintUSDC.ts --network ${SIDE_NETWORK} --contract ${USDC_CONTRACT} --to ${ADDRESS_SIDE}`
  );

  return {
    SIDE_CONTRACT,
    USDC_CONTRACT,
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
  await runCommand(
    `npx hardhat setMainChainRaffleToSidechain --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --raffle ${MAIN_CONTRACT}`
  );

  await runCommand(
    `npx hardhat setMainChainSelectorToSidechain --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --selector ${MAIN_CHAIN_SELECTOR}`
  );

  await runCommand(
    `npx hardhat allowDestinationChain --network ${MAIN_CHAIN} --contract ${MAIN_CONTRACT} --selector ${SIDE_CHAIN_SELECTOR} --allow true`
  );

  await runCommand(
    `npx hardhat allowlistSourceChain --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --selector ${MAIN_CHAIN_SELECTOR} --allow true`
  );

  await runCommand(
    `npx hardhat allowlistSender --network ${SIDE_CHAIN} --contract ${SIDE_CONTRACT} --externalcontract ${MAIN_CONTRACT} --allow true`
  );

  await runCommand(
    `npx hardhat allowlistSourceChain --network ${MAIN_CHAIN} --contract ${MAIN_CONTRACT} --selector ${SIDE_CHAIN_SELECTOR} --allow true`
  );

  await runCommand(
    `npx hardhat allowlistSender --network ${MAIN_CHAIN} --contract ${MAIN_CONTRACT} --externalcontract ${SIDE_CONTRACT} --allow true`
  );
}

main();
