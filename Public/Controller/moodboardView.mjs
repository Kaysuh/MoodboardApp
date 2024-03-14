import { saveMoodboard } from '../Model/moodboardModel.mjs';

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://moodboardapp.onrender.com';

async function loadNameField() {
    try {
        const response = await fetch('/View/nameFieldTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#nameFieldTemplate').content;
        const container = document.querySelector('#moodboardContainer');

        container.appendChild(document.importNode(template, true));
    } catch (error) {
        console.error('Failed to load name field template:', error);
    }
}

export async function loadMoodboardView() {
    try {
        const response = await fetch('/View/moodboardCreationTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#moodboardCreationTemplate').content;

        const container = document.querySelector('#moodboardContainer');
        container.innerHTML = '';
        const importedNode = document.importNode(template, true);
        container.appendChild(importedNode);

        loadNameField()
        initializeCreationArea(container);
        initializeSaveButton()
    } catch (error) {
        console.error('Failed to load moodboard creation template:', error);
    }
}

function initializeCreationArea(container) {
    container.addEventListener('dragover', allowDrop);
    container.addEventListener('dragleave', handleDragLeaveOrDrop);
    container.addEventListener('drop', drop);
    container.addEventListener('click', handleClick);
}

function initializeSaveButton() {
    const saveButton = document.getElementById('saveMoodboardButton');
    if (saveButton) {
        saveButton.addEventListener('click', async () => {
            const moodboardNameInput = document.getElementById('moodboardNameInput');
            const moodboardName = moodboardNameInput.value;
            if (!moodboardName) {
                alert('Please enter a name for your moodboard.');
                return;
            }

            const images = Array.from(document.querySelectorAll('.moodboard-creation-area img')).map(img => ({
                url: img.src
            }));

            const moodboardData = { name: moodboardName, images };
            await saveMoodboard(apiUrl, moodboardData);
        });
    }
}

function allowDrop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains('moodboard-creation-area')) {
        ev.target.classList.add('over');
    }
}

function handleDragLeaveOrDrop(ev) {
    ev.preventDefault();
    if (ev.target.classList.contains('moodboard-creation-area')) {
        ev.target.classList.remove('over');
    }
}

function drop(ev) {
    ev.preventDefault();
    let creationArea = ev.target;
    if (!creationArea.classList.contains('moodboard-creation-area')) return;
    creationArea.classList.remove('over');

    processFiles(ev.dataTransfer.files, creationArea);
}

function handleClick(ev) {
    let creationArea = ev.target.closest('.moodboard-creation-area');
    if (!creationArea) return;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = () => processFiles(fileInput.files, creationArea);
    fileInput.click();
}

function processFiles(files, container) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            displayImage(file, container);
        }
    });
}

function displayImage(file, container) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.src = e.target.result;

        const numImages = container.children.length;
        const gridSideLength = Math.ceil(Math.sqrt(numImages + 1));
        container.style.gridTemplateColumns = `repeat(${gridSideLength}, 1fr)`;
        img.classList.add('moodboard-item-creation');
        container.appendChild(img);
        if (container.children.length === 1) {
            container.classList.add('not-empty');
        }
    };
    reader.readAsDataURL(file);
}
