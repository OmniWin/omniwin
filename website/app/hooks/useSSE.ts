'use client';

import { useEffect } from 'react';
import eventSourceSingleton from '@/lib/eventSourceSingleton';

// Adjust the hook to accept a callback function
function useEventSourceListener(callback: (eventData: any) => void): void {
    useEffect(() => {
        const eventSource = eventSourceSingleton.getEventSource();

        const messageHandler = (event: MessageEvent) => {
            try {
                const eventData = JSON.parse(event.data);
                callback(eventData);
            } catch (error) {
                console.error('Error parsing event data:', error, event.data);
            }
        };

        eventSource?.addEventListener('message', messageHandler);

        return () => {
            eventSource?.removeEventListener('message', messageHandler);
        };
    }, [callback]);
}

export default useEventSourceListener;