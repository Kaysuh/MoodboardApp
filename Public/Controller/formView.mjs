import { userLogin, userRegistration } from '../Model/userAuthModel.mjs';

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://moodboardapp.onrender.com';

export async function loadForm() {
    try {
        const response = await fetch('/View/formTemplate.html');
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const template = doc.querySelector('#formTemplate').content;

        document.body.appendChild(document.importNode(template, true));
        initializeForm();
    } catch (error) {
        console.error('Failed to load form template:', error);
    }
}

function initializeForm() {
    const authForm = document.getElementById('authForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const userAuthForm = document.getElementById("userAuthForm");

    document.getElementById('continueButton').addEventListener('click', async () => {
        if (authForm.classList.contains('login-form')) {
            const response = await userLogin(email.value, password.value, apiUrl);
            if (response.ok) {
                userAuthForm.style.display = "none";
                const data = await response.json();
                sessionStorage.setItem('userToken', data.data.token);
                sessionStorage.setItem('userProfilePicture', data.data.userResponse.profilePicture)
                sessionStorage.setItem('isAdmin', data.data.userResponse.isAdmin);
                window.location.reload();
            } else {
                loginErrorAnim();
            }
        } else {
            const userName = document.getElementById('userName');
            const profilePicture = document.getElementById('profilePicture');
            if (profilePicture.files.length > 0) {
                const file = profilePicture.files[0];
                if (file.size > 1048576) {
                    alert('Error: Image size exceeds 1MB limit.');
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const profilePic = reader.result;
                    const response = await userRegistration(email.value, password.value, userName.value, profilePic, apiUrl);
                    if (response.ok) {
                        userAuthForm.style.display = "none";
                        window.location.reload();
                        toggleForm();
                    } else {
                        alert('Registration failed. Please try again.');
                    }
                };
                reader.readAsDataURL(file);
            }
        }
    });

    document.getElementById('toggleButton').addEventListener('click', toggleForm);
}

function toggleForm() {
    const authForm = document.getElementById('authForm');
    const formTitle = document.getElementById('formTitle');
    const toggleButton = document.getElementById('toggleButton');
    authForm.classList.toggle('login-form');
    authForm.classList.toggle('signup-form');

    if (authForm.classList.contains('signup-form')) {
        formTitle.textContent = 'Sign up';

        const nameContainer = document.createElement('div');
        nameContainer.className = 'input-container';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.id = "userName";
        nameInput.placeholder = 'Username';
        nameContainer.appendChild(nameInput);
        authForm.appendChild(nameContainer);

        const imageContainer = document.createElement('div');
        imageContainer.className = 'input-container';
        const imageInput = document.createElement('input');
        imageInput.type = 'file';
        imageInput.id = "profilePicture";
        imageInput.accept = 'image/*';
        imageInput.placeholder = 'Upload profile picture';
        imageContainer.appendChild(imageInput);
        authForm.appendChild(imageContainer);

        toggleButton.textContent = "Sign in instead?";
    } else {
        toggleButton.textContent = "Sign up instead?";
        formTitle.textContent = 'Sign in';

        const nameInput = document.querySelector('#authForm .input-container #userName');
        const imageInput = document.querySelector('#authForm .input-container #profilePicture');
        if (nameInput && nameInput.parentNode) {
            nameInput.parentNode.remove();
        }
        if (imageInput && imageInput.parentNode) {
            imageInput.parentNode.remove();
        }
    }
}

function loginErrorAnim() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    email.classList.add('shake-animation')
    password.classList.add('shake-animation')
    email.style.borderColor = 'red'
    password.style.borderColor = 'red'

    setTimeout(() => {
        email.classList.remove('shake-animation');
        password.classList.remove('shake-animation');
        email.style.borderColor = 'white'
        password.style.borderColor = 'white'
    }, 500);
}