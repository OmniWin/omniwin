const getDomain = () => process.env[typeof window === 'undefined' ? 'NEXT_PUBLIC_SSR_API_URL' : 'NEXT_PUBLIC_API_URL'];

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
        const url = `${getDomain()}/v1/user/settings`;
        const response = await fetch(url, {
            credentials: "include",
        });

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