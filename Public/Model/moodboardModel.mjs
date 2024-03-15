export async function loadMoodboards(apiUrl, token) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            apiUrl += '/moodboard/user';
        } else {
            apiUrl += '/moodboard'; // If no token, append only '/moodboard'
        }
        const response = await fetch(`${apiUrl}`, {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Failed to load moodboards:', error);
        throw error;
    }
}

export async function saveMoodboard(apiUrl, moodboardData) {
    try {
        const token = sessionStorage.getItem('userToken');
        console.log(token)
        const response = await fetch(`${apiUrl}/moodboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(moodboardData)
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            alert('Your moodboard has been successfully created!');
            window.location.reload();
        } else if (response.status === 403) {
            alert('You must be logged in to create a moodboard.');
        }
    } catch (error) {
        console.error('Failed to save moodboard:', error);
        alert(`Failed to save moodboard: ${error.message || 'Unknown error'}`);
    }
}

export async function deleteMoodboard(apiUrl, token, moodboardId) {
    try {
        const response = await fetch(`${apiUrl}/moodboard/${moodboardId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to delete moodboard');
        }
        return response;
    } catch (error) {
        console.error('Failed to delete moodboard:', error);
        throw error;
    }
}

