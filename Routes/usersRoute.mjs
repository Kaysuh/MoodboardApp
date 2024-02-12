import express, { json, response } from "express";
import User from "../modules/user.mjs";

const USER_API = express.Router();
USER_API.use(express.json());

export const users = [];

// USER_API.get('/:id', (req, res) => {
// })

USER_API.get('/', (req, res) => {
    res.sendSuccess(users);
});


let nextUserId = 1
USER_API.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    if (name != "" && email != "" && password != "") {
        const user = new User();
        user.name = name;
        user.email = email;
        user.id = nextUserId++;

        ///TODO: Do not save passwords.
        user.pswHash = password;
        let exists = users.some(user => user.email === email);

        if (!exists) {
            users.push(user);
            res.sendSuccess(users, 201);
        } else {
            res.sendError(new Error('User already exists'), 400);
        }
    } else {
        res.sendError(new Error('Missing name, email, or password'), 400);
    }
});


USER_API.post('/login', (req, res) => {
    const { email, password } = req.body;
    //TODO: add auth scheme
    // const authHeader = req.headers.authorization;

    if (email !== '' && password !== '') {
        const user = users.find(u => u.email === email && u.pswHash === password);

        if (user) {
            res.sendSuccess(user, 200);
        } else {
            res.sendError(new Error('Wrong username or password.'), 400);
        }
    } else {
        res.sendError(new Error('Email and password must not be empty.'), 400);
    }
});

USER_API.put('/:id', (req, res) => {
    const userIdToUpdate = parseInt(req.params.id, 10);
    const updatedUserData = req.body;
    const userIndex = users.findIndex(user => user.id === userIdToUpdate);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUserData };
        res.sendSuccess(users, 200);
    } else {
        res.sendError(new Error(), 404);
    }
});


USER_API.delete('/:id', (req, res) => {
    const userIdToDelete = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(user => user.id === userIdToDelete);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.sendSuccess(users, 200);
    } else {
        res.sendError(new Error(), 404);
    }
});


export default USER_API