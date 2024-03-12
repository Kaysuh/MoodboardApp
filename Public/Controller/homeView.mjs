import { loadForm } from "./formView.mjs";
async function loadHeader() {
    try {
        const response = await fetch('/view/headerTemplate.html');
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

function initializeHeader() {
    document.getElementById('loginButton').addEventListener('click', async () => {
        loadForm()
    });
}

async function loadMoodboards() {
    try {
        const response = await fetch('/view/moodboardTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#moodboardTemplate').content;
        document.body.appendChild(document.importNode(template, true));
        initializeMoodboards()
    } catch (error) {
        console.error('Failed to load moodboard template:', error);
    }
}

function initializeMoodboards() {
    const moodboards = document.querySelectorAll('.moodboard-item');

    function allowDrop(ev) {
        ev.preventDefault();
        ev.target.closest('.moodboard-item').classList.add('over');
    }

    function handleDragLeaveOrDrop(ev) {
        ev.target.closest('.moodboard-item').classList.remove('over');
    }

    function drag(ev) {
        if (ev.target.tagName === 'IMG') {
            ev.dataTransfer.setData("text/plain", ev.target.src);
        }
    }

    function drop(ev) {
        ev.preventDefault();
        ev.target.closest('.moodboard-item').classList.remove('over');
        const moodboardItem = ev.target.closest('.moodboard-item');

        if (ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
            const file = ev.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                displayImage(file, moodboardItem);
            }
        } else {
            const url = ev.dataTransfer.getData("text");
            if (url) {
                displayImage(url, moodboardItem);
            }
        }
    }

    function displayImage(src, container) {
        container.style.backgroundColor = 'transparent';
        container.innerHTML = '';

        const newImage = new Image();
        if (typeof src === 'string') {
            newImage.src = src;
        } else if (src instanceof File) {
            newImage.src = window.URL.createObjectURL(src);
        }
        newImage.style.maxWidth = '100%';
        newImage.style.maxHeight = '100%';
        container.innerHTML = '';
        container.appendChild(newImage);
    }

    function handleClick(ev) {
        const moodboardItem = ev.target.closest('.moodboard-item');
        if (!moodboardItem) return;

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = e => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                displayImage(file, moodboardItem);
            }
        };
        fileInput.click();
    }

    moodboards.forEach(item => {
        item.addEventListener('dragover', allowDrop);
        item.addEventListener('dragleave', handleDragLeaveOrDrop);
        item.addEventListener('drop', drop);
        item.addEventListener('click', handleClick);
    });
}

async function loadFooter() {
    try {
        const response = await fetch('/view/footerTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#footerTemplate').content;

        document.body.appendChild(document.importNode(template, true));
    } catch (error) {
        console.error('Failed to load footer template:', error);
    }
}

async function loadHome() {
    try {
        await loadHeader()
        await loadMoodboards()
        loadFooter()
    } catch (error) {
        console.error('Failed to load home view templates', error);
    }
}

loadHome()
