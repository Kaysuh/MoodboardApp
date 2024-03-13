export async function userLogin(email, password, apiUrl) {
    const loginData = {
        email: email.value,
        password: password.value
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

export async function userRegistration(name, email, password, apiUrl) {
    const userData = {
        name: name,
        email: email,
        password: password
    };

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    };

    try {
        const response = await fetch(`${apiUrl}/user/register`, fetchOptions);
        return response;
    } catch (error) {
        throw error;
    }
}
