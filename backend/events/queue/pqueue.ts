
import PQueue from 'p-queue';
import { listenerConfig,ChainIds } from '../config/config';

class QueueService {
  private static instances: Map<ChainIds, QueueService> = new Map();
  private queue: PQueue;

  private constructor(chainId: ChainIds) {
    const { concurrency } = listenerConfig[chainId];
    this.queue = new PQueue({ concurrency });
  }

  public static getInstance(chainId: ChainIds): QueueService {
    if (!QueueService.instances.has(chainId)) {
      QueueService.instances.set(chainId, new QueueService(chainId));
    }
    return QueueService.instances.get(chainId)!;
  }

  public getQueue(): PQueue {
    return this.queue;
  }
}

export default QueueService;
