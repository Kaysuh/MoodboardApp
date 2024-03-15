import { loadForm } from "./formView.mjs";
import { loadMoodboards } from "../Model/moodboardModel.mjs";
import { loadMoodboardView } from "./moodboardView.mjs";
import { loadProfileView } from "./profileView.mjs";

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://moodboardapp.onrender.com';

async function loadHeader() {
    try {
        const response = await fetch('/View/headerTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#headerTemplate').content;

        document.body.appendChild(document.importNode(template, true));
        initializeHeader()
    } catch (error) {
        console.error('Failed to load header template:', error);
    }
}

async function loadMoodboardContainer() {
    try {
        const response = await fetch('/View/moodboardContainerTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#moodboardContainerTemplate').content;
        document.body.appendChild(document.importNode(template, true));
    } catch (error) {
        console.error('Failed to load moodboard container template:', error);
    }
}

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

async function loadFooter() {
    try {
        const response = await fetch('/View/footerTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#footerTemplate').content;

        document.body.appendChild(document.importNode(template, true));
    } catch (error) {
        console.error('Failed to load footer template:', error);
    }
}

async function displayMoodboards() {
    try {
        const { status, data } = await loadMoodboards(apiUrl);
        const templateElement = await loadMoodboardTemplate()
        if (!templateElement) {
            throw new Error('Moodboard template could not be loaded');
        }
        const templateContent = templateElement.content;

        if (status === "OK" && data.length) {
            const container = document.querySelector('#moodboardContainer');
            container.innerHTML = '';

            data.forEach(moodboard => {
                const moodboardClone = document.importNode(templateContent, true);
                const moodboardElement = moodboardClone.querySelector('.moodboard')

                moodboardElement.innerHTML = '';

                moodboard.images.forEach(image => {
                    const item = document.createElement('div');
                    item.className = 'moodboard-item';
                    item.style.backgroundImage = `url(${image.url})`;
                    item.title = image.title;
                    moodboardElement.appendChild(item);
                });
                container.appendChild(moodboardClone);
            });
        }
    } catch (error) {
        console.error('Failed to load moodboards:', error);
    }
}

async function loadHome() {
    try {
        document.body.innerHTML = '';
        await loadHeader();
        await loadMoodboardContainer();
        await displayMoodboards();
        loadFooter();
    } catch (error) {
        console.error('Failed to load home view templates', error);
    }
}

function initializeHeader() {
    document.getElementById('homeButton').addEventListener('click', async () => {
        loadHome();
    });
    document.getElementById('createButton').addEventListener('click', async () => {
        loadMoodboardView();
    });

    const token = sessionStorage.getItem('userToken');
    const profilePic = document.getElementById('profilePic');
    const profileMenu = document.getElementById('profileMenu');
    const profileMenuItem = document.querySelector('.profile-menu');
    const loginButton = document.getElementById('loginButton');

    if (token) {
        const userProfilePicture = sessionStorage.getItem('userProfilePicture')
        if (userProfilePicture && userProfilePicture !== 'null' && userProfilePicture.trim() !== '') {
            profilePic.src = userProfilePicture;
        } else {
            profilePic.src = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg';
        }

        profileMenuItem.style.display = 'block';
        loginButton.style.display = 'none';

        profilePic.addEventListener('click', () => {
            profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.getElementById('viewProfileButton').addEventListener('click', () => {
            profileMenu.style.display = 'none';
            loadProfileView()
        });

        document.getElementById('signOutButton').addEventListener('click', async () => {
            sessionStorage.removeItem('userToken');
            loadHome();
        });
    } else {
        profileMenuItem.style.display = 'none';
        loginButton.style.display = 'block';

        loginButton.addEventListener('click', async () => {
            loadForm();
        });
    }
}

loadHome();

