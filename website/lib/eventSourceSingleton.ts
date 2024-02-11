'use client';
// EventSourceSingleton.ts
class EventSourceSingleton {
    private static instance: EventSourceSingleton;
    private eventSource: EventSource | null;

    private constructor(url: string) {
        if (typeof window !== "undefined") { // Check if running in a browser
            this.eventSource = new EventSource(url);
        } else {
            this.eventSource = null;
            console.log("event source not supported")
        }
    }

    public static getInstance(url: string): EventSourceSingleton {
        if (!EventSourceSingleton.instance) {
            EventSourceSingleton.instance = new EventSourceSingleton(url);
            Object.freeze(EventSourceSingleton.instance);
        }
        return EventSourceSingleton.instance;
    }

    public getEventSource(): EventSource | null {
        return this.eventSource;
    }

    // Additional methods to manage the connection can be added here
}

// Usage example (assuming the URL won't change after the first instantiation)
const eventSourceSingleton = EventSourceSingleton.getInstance('http://localhost/v1/events');
export default eventSourceSingleton;
