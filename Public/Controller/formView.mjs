import { userLogin, userRegistration } from '../Model/userAuth.mjs';

const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:8080' : 'https://moodboardapp.onrender.com';

async function loadForm() {
    try {
        const response = await fetch('/view/formTemplate.html');
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

export function initializeForm() {
    const authForm = document.getElementById('authForm');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const name = document.getElementById('name');
    const userAuthForm = document.getElementById("userAuthForm");

    document.getElementById('continueButton').addEventListener('click', async () => {
        if (authForm.classList.contains('login-form')) {
            const response = await userLogin(email, password, apiUrl);
            if (response.ok) {
                userAuthForm.style.display = "none";
                // Further actions upon successful login
            } else {
                loginErrorAnim();
            }
        } else {
            const response = await userRegistration(name, email, password, apiUrl);
            if (response.ok) {
                toggleForm();
            }
            // Else, handle registration errors
        }
    });

    document.getElementById('toggleButton').addEventListener('click', toggleForm);
}

function toggleForm() {
    const authForm = document.getElementById('authForm');
    const formTitle = document.getElementById('formTitle');
    const toggleButton = document.getElementById('toggleButton')
    authForm.classList.toggle('login-form');
    authForm.classList.toggle('signup-form');

    if (authForm.classList.contains('signup-form')) {
        formTitle.textContent = 'Sign up';
        const nameInput = document.createElement('input');
        toggleButton.textContent = "Sign in instead?"
        nameInput.type = 'text';
        nameInput.id = "name"
        nameInput.placeholder = 'Name';
        nameInput.name = 'name';
        authForm.appendChild(nameInput);
    } else {
        toggleButton.textContent = "Sign up instead?"
        formTitle.textContent = 'Sign in';
        const nameInput = document.querySelector('#authForm input[name="name"]');
        if (nameInput) {
            authForm.removeChild(nameInput);
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

loadForm();
