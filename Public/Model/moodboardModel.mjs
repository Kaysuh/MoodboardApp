export async function loadMoodboards(apiUrl) {
    try {
        const response = await fetch(`${apiUrl}/moodboard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log(data)
        return data;
    } catch (error) {
        throw error;
    }
}

export async function saveMoodboard(apiUrl, moodboardData) {
    try {
        const response = await fetch(`${apiUrl}/moodboard`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(moodboardData)
        });
        const data = await response.json();
        console.log(data);
        alert('Your moodboard has been successfully created!');
        window.location.reload()
    } catch (error) {
        console.error('Failed to save moodboard:', error);
    }
}
