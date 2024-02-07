import express, { json, response } from "express";
import User from "../modules/user.mjs";
import httpResponseHandler from "../Modules/httpResponseHandler.mjs";


const USER_API = express.Router();

export const users = [];

USER_API.get('/:id', (req, res) => {
    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)
    /// TODO: 
    // Return user object
})

USER_API.get('/', (req, res) => {
    httpResponseHandler.handleResponse(req, res, null, 200, users);
})

let nextUserId = 1
USER_API.post('/register', (req, res, next) => {
    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {
        const user = new User();
        user.name = name;
        user.email = email;
        user.id = nextUserId++

        ///TODO: Do not save passwords.
        user.pswHash = password;
        let exists = users.some(user => user.email === email);

        if (!exists) {
            users.push(user);
            httpResponseHandler.handleResponse(req, res, null, 201, users);
        } else {
            httpResponseHandler.handleResponse(req, res, new Error('User already exists'), 400);
        }
    } else {
        httpResponseHandler.handleResponse(req, res, new Error('Unexpected error'), 500);
    }

});

USER_API.post('/login', (req, res) => {
    const { email, password } = req.body;
    //TODO: add auth scheme
    // const authHeader = req.headers.authorization;

    if (email !== '' && password !== '') {
        const user = users.find(u => u.email === email && u.pswHash === password);

        if (user) {
            httpResponseHandler.handleResponse(req, res, null, 200, user);
        } else {
            httpResponseHandler.handleResponse(req, res, new Error('Wrong username or password.'), 400);
        }
    } else {
        httpResponseHandler.handleResponse(req, res, new Error('Unexpected error'), 500);
    }
});

USER_API.put('/:id', (req, res) => {
    const userIdToUpdate = parseInt(req.params.id, 10);
    const updatedUserData = req.body;
    const userIndex = users.findIndex(user => user.id === userIdToUpdate);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUserData };
        httpResponseHandler.handleResponse(req, res, null, 200, null);
    } else {
        httpResponseHandler.handleResponse(req, res, new Error(), 404);
    }
});


USER_API.delete('/:id', (req, res) => {
    const userIdToDelete = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(user => user.id === userIdToDelete);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        httpResponseHandler.handleResponse(req, res, null, 200, null);
    } else {
        httpResponseHandler.handleResponse(req, res, new Error(), 404);
    }
});


export default USER_API