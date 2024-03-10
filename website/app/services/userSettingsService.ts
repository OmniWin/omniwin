
const getDomain = () => {
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_SSR_API_URL;
    }

    return process.env.NEXT_PUBLIC_API_URL;
}

export const syncSocialPlatforms = async (platform: string, data: any) => {
    try {
        const response = await fetch(`${getDomain()}/v1/user/social/sync`, {
            method: 'POST',
            body: JSON.stringify({ platform, data }),
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

export const fetchUserSettingsData = async () => {
    try {
        const response = await fetch(`${getDomain()}/v1/user/settings`, {
            credentials: "include",
        });

        console.log('response muie', response);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data; // assuming data contains the session
    } catch (error) {
        console.error('Error fetching session:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}