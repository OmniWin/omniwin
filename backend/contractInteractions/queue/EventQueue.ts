type QueueTask<T> = {
    data: T;
    process: (data: T) => Promise<void>;
};

export class EventQueue<T> {
    private queue: QueueTask<T>[] = [];
    private processing: boolean = false;

    async enqueue(data: T, process: (data: T) => Promise<void>) {
        this.queue.push({ data, process });
        if (!this.processing) {
            this.processing = true;
            await this.processQueue();
        }
    }

    private async processQueue() {
        while (this.queue.length > 0) {
            const task = this.queue.shift();
            if (task) {
                await task.process(task.data);
            }
        }
        this.processing = false;
    }
}
