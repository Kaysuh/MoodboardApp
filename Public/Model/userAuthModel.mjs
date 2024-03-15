export async function userLogin(email, password, apiUrl) {
    const loginData = {
        email: email,
        password: password
    };

    try {
        const response = await fetch(`${apiUrl}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData),
        });

        return response;
    } catch (error) {
        throw error;
    }
}

export async function userRegistration(email, password, userName, apiUrl) {
    const userData = {
        email: email,
        password: password,
        userName: userName
    };
    
    try {
        const response = await fetch(`${apiUrl}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData),
        });

        return response;
    } catch (error) {
        throw error;
    }
}
