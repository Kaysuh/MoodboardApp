import { loadMoodboards, deleteMoodboard } from "../Model/moodboardModel.mjs";
import { fetchUsers, deleteUser } from "../Model/userModel.mjs";

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://moodboardapp.onrender.com';

async function loadMoodboardTemplate() {
    try {
        const response = await fetch('/View/moodboardTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        return doc.querySelector('template');
    } catch (error) {
        console.error('Failed to load moodboard template:', error);
        return null;
    }
}

export async function loadAdminView() {
    const container = document.querySelector('#moodboardContainer');
    const token = sessionStorage.getItem('userToken');
    container.innerHTML = '';

    const userButton = document.createElement('button');
    userButton.innerText = 'User';
    userButton.addEventListener('click', async () => {
        try {
            const users = await fetchUsers(token, apiUrl);
            const container = document.querySelector('#moodboardContainer');
            container.innerHTML = '';

            const userList = document.createElement('ul');
            users.data.forEach(user => {
                const userItem = document.createElement('li');
                userItem.textContent = user.userName || user.email;

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.addEventListener('click', async () => {
                    const isConfirmed = confirm(`Are you sure you want to delete ${user.userName || user.email}?`);
                    if (isConfirmed) {
                        try {
                            await deleteUser(user.id, token, apiUrl);
                            window.location.reload()
                        } catch (error) {
                            alert('Failed to delete user: ' + error.message);
                        }
                    }
                });

                userItem.appendChild(deleteButton);
                userList.appendChild(userItem);
            });

            container.appendChild(userList);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    });

    const moodboardButton = document.createElement('button');
    moodboardButton.innerText = 'Moodboard';
    moodboardButton.addEventListener('click', async () => {
        const { status, data } = await loadMoodboards(apiUrl);
        const container = document.querySelector('#moodboardContainer');
        container.innerHTML = '';

        if (status === "OK" && data.length) {
            const templateElement = await loadMoodboardTemplate();
            if (!templateElement) {
                throw new Error('Moodboard template could not be loaded');
            }
            const templateContent = templateElement.content;

            data.forEach(moodboard => {
                const moodboardClone = document.importNode(templateContent, true);
                const moodboardElement = moodboardClone.querySelector('.moodboard');

                moodboardElement.innerHTML = '';

                moodboard.images.forEach(image => {
                    const item = document.createElement('div');
                    item.className = 'moodboard-item';
                    item.style.backgroundImage = `url(${image.url})`;
                    moodboardElement.appendChild(item);
                });

                const deleteButton = document.createElement('button');
                deleteButton.innerText = 'Delete';
                deleteButton.className = 'delete-button';
                deleteButton.addEventListener('click', async () => {
                    try {
                        const response = await deleteMoodboard(apiUrl, token, moodboard.id);
                        if (response.ok) {
                            window.location.reload()
                        } else {
                            console.error('Failed to delete moodboard');
                        }
                    } catch (error) {
                        console.error('Error deleting moodboard:', error);
                    }
                });

                moodboardElement.appendChild(deleteButton);
                container.appendChild(moodboardClone);
            });
        } else {
            console.log('No moodboards to display or error fetching them');
        }
    });

    container.appendChild(userButton);
    container.appendChild(moodboardButton);
}
