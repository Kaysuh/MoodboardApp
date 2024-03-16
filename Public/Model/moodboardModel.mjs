export async function loadMoodboards(apiUrl, token) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            apiUrl += '/moodboard/user';
        } else {
            apiUrl += '/moodboard';
        }
        const response = await fetch(`${apiUrl}`, {
            method: 'GET',
            headers: headers
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load moodboards:', error);
        throw error;
    }
}

export async function saveMoodboard(apiUrl, moodboardData) {
    try {
        const token = sessionStorage.getItem('userToken');
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

export async function searchMoodboards(apiUrl, searchQuery) {
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const response = await fetch(`${apiUrl}/moodboard/search?name=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: headers
        });
        if (!response.ok) {
            throw new Error(`Failed to search moodboards with status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to search moodboards:', error);
        throw error;
    }
}


