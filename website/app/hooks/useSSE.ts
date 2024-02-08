'use client';
// hooks/useSSE.ts
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import { updateCounts } from '../redux/actions'; // Adjust this import to your actual actions

const useSSE = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const eventSource = new EventSource('http://localhost/v1/events');

        eventSource.onmessage = (event) => {
            const newMessage = JSON.parse(event.data);
            console.log('New message:', newMessage);
            // Dispatch an action to update the Redux store
            // dispatch(updateCounts(newMessage));
        };

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error);
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [dispatch]);
};

export default useSSE;
