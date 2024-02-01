import type { SIWEVerifyMessageArgs } from '@web3modal/core'
import { useSelector, useDispatch, userSettingsSlice } from "@/lib/redux";
import { selectUserSettingsState } from "@/lib/redux/slices/userSettingsSlice/selectors";

export const getNonce = async () => {
    try {
        const response = await fetch('http://localhost:4356/v1/auth/nonce');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('response', response)
        const data = await response.text();
        console.log('data', data)
        return data; // assuming data contains the nonce
    } catch (error) {
        console.error('Error fetching nonce:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
};

export const getSession = async () => {
    try {
        const response = await fetch('http://localhost:4356/v1/auth/session', {
            credentials: 'include',
        });

        if (!response.ok) throw new Error('Session fetch failed');

        const data = await response.json();
        return data; // assuming data contains the session
    } catch (error) {
        console.error('Error fetching session:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}

export const validateMessage = async ({ message, signature }: SIWEVerifyMessageArgs) => {
    const userSettingsState = useSelector(selectUserSettingsState);
    const dispatch = useDispatch();

    try {
        const response = await fetch('http://localhost:4356/v1/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ message, signature }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        const jwt = data.token;
        dispatch(userSettingsSlice.actions.setJwt(jwt))

        return data; // assuming data contains the session
    } catch (error) {
        console.error('Error validating message:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}

export const signOut = async () => {
    try {
        const response = await fetch('http://localhost:4356/v1/auth/signout', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; // assuming data contains the session
    } catch (error) {
        console.error('Error signing out:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}