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
                console.log(data)
                window.location.reload()
            } else {
                loginErrorAnim();
            }
        } else {
            const userName = document.getElementById('userName');
            const response = await userRegistration(email.value, password.value, userName.value, apiUrl);
            if (response.ok) {
                userAuthForm.style.display = "none";
                window.location.reload()
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
        nameInput.id = "userName"
        nameInput.placeholder = 'Username';
        authForm.appendChild(nameInput);
    } else {
        toggleButton.textContent = "Sign up instead?"
        formTitle.textContent = 'Sign in';
        const nameInput = document.querySelector('#authForm input[userName="userName"]');
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