const domain = process.env.NEXT_PUBLIC_API_URL;

export const createAccount = async (body: any) => {
    try {
        const response = await fetch(`${domain}/v1/user`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            // throw new Error('Network response was not ok');
            return false;
        }

        const user = await response.json();

        return user;
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

        const exists = await response.json();

        return exists;
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

        const isValid = await response.json();

        return isValid;
    } catch (error) {
        console.error('Error validating message:', error);
        throw error; // Rethrow the error if you want to handle it outside
    }
}