import { loadMoodboards, deleteMoodboard } from "../Model/moodboardModel.mjs";

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://moodboardapp.onrender.com';

export async function loadProfileView() {
    try {
        const token = sessionStorage.getItem('userToken');
        const moodboards = await loadMoodboards(apiUrl, token);
        const container = document.querySelector('#moodboardContainer');
        container.innerHTML = '';

        const templateElement = await loadMoodboardTemplate();
        if (!templateElement) throw new Error('Moodboard template could not be loaded');

        moodboards.forEach(moodboard => {
            const moodboardClone = document.importNode(templateElement.content, true);
            const moodboardElement = moodboardClone.querySelector('.moodboard');
            moodboardElement.innerHTML = '';

            moodboard.images.forEach(image => {
                const item = document.createElement('div');
                item.className = 'moodboard-item';
                item.style.backgroundImage = `url(${image.url})`;
                moodboardElement.appendChild(item);
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', async () => {
                try {
                    const response = await deleteMoodboard(apiUrl, token, moodboard.id);
                    if (response.ok) {
                        alert("Your moodboard has been deleted!")
                        location.reload();
                    } else {
                        throw new Error('Failed to delete moodboard');
                    }
                } catch (error) {
                    console.error(error.message);
                }
            });

            moodboardElement.appendChild(deleteButton);
            container.appendChild(moodboardClone);
        });
    } catch (error) {
        console.error('Failed to load profile view:', error);
    }
}

async function loadMoodboardTemplate() {
    try {
        const response = await fetch('/View/moodboardTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const templateElement = doc.querySelector('#moodboardTemplate');

        return templateElement;
    } catch (error) {
        console.error('Failed to load moodboard template:', error);
        return null;
    }
}



