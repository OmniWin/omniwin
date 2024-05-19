import { listenerConfig, ChainIds} from './config/config'
import MainContractEvents from './services/mainContractEvents'
import logger from './log/logger';

const CHAIN_ID = ChainIds.BNB_CHAIN_TESTNET;
const { providerHistory, contract } = listenerConfig[CHAIN_ID];


async function main() {
  logger.info(`Starting listener for chain ${CHAIN_ID}`);
  const eventNames = ["CreateRaffleToSidechain","EntrySold","CreateRaffle"];
  // const eventName = ["CreateRaffle"];

  const startBlock = 40445570;
  const mainContract = new MainContractEvents(CHAIN_ID);
  await mainContract.fetchHistoricalEvents(contract, eventNames, providerHistory,startBlock);
  mainContract.listenForNewEvents(contract, eventNames);
}

main().catch(console.error);
