const domain = process.env.NEXT_PUBLIC_API_URL;
// const domain = 'http://omniwin.local/b';

export const createAccount = async (body: any) => {
    try {
        const response = await fetch(`${domain}/v1/user`, {
            method: 'POST',
            body: JSON.stringify(body),
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            // throw new Error('Network response was not ok');
            return false;
        }

        const jsonData = await response.json();

        return jsonData.data;
    } catch (error) {
        console.error('Error validating message:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}

export const checkIfUserExists = async (address: string) => {
    try {
        const response = await fetch(`${domain}/v1/user/exists`, {
            method: 'POST',
            body: JSON.stringify({ address }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();

        return jsonData.data.exists;
    } catch (error) {
        console.error('Error validating message:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}

export const validateReferralCode = async (referralCode: string) => {
    try {
        const response = await fetch(`${domain}/v1/referral/validate`, {
            method: 'POST',
            body: JSON.stringify({ referralCode }),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            // throw new Error('Network response was not ok');
            return false;
        }

        const jsonData = await response.json();

        return jsonData.data;
    } catch (error) {
        console.error('Error validating message:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}