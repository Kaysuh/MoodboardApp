export async function fetchUsers(token, apiUrl) {
    try {
        const response = await fetch(`${apiUrl}/user`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Failed to fetch users:', error);
        throw error;
    }
}

export async function deleteUser(userId, token, apiUrl) {
    try {
        const response = await fetch(`${apiUrl}/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Failed to delete user:', error);
        throw error;
    }
}
