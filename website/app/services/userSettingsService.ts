// const getDomain = () => process.env[typeof window === 'undefined' ? 'NEXT_PUBLIC_SSR_API_URL' : 'NEXT_PUBLIC_API_URL'];
const domain = 'http://omniwin.local/b';

export const syncSocialPlatforms = async (platform: string, data: any) => {
    try {
        const response = await fetch(`${domain}/v1/user/social/sync`, {
            method: 'POST',
            body: JSON.stringify({ platform, data }),
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();

        if (!jsonData.success) {
            throw new Error(jsonData.message);
        }

        return jsonData.data;
    } catch (error) {
        console.error('Error validating message:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}

export const fetchUserSettingsData = async () => {
    try {
        const url = `${domain}/v1/user/settings`;
        const response = await fetch(url, {
            credentials: "include",
        });

        if (!response.ok) {
            return null;
        }

        const jsonData = await response.json();
        return jsonData.data;
    } catch (error) {
        console.error('Error fetching session:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}