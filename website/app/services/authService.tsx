import type { SIWEVerifyMessageArgs } from '@web3modal/core'
const domain = "http://localhost"

export const getNonce = async () => {
    try {
        const response = await fetch(`${domain}/v1/auth/nonce`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        console.log('nonce', data)
        return data; // assuming data contains the nonce
    } catch (error) {
        console.error('Error fetching nonce:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
};

export const getSession = async () => {
    try {
        const response = await fetch(`${domain}/v1/auth/session`, {
            credentials: "include",
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
    try {
        const response = await fetch(`${domain}/v1/auth/verify`, {
            method: 'POST',
            body: JSON.stringify({ message, signature }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const isValid = await response.json();

        return isValid;
    } catch (error) {
        console.error('Error validating message:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}

export const signOut = async () => {
    try {
        const response = await fetch(`${domain}/v1/auth/signout`, {
            method: 'POST',
            credentials: "include",
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