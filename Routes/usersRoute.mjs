import express, { json, response } from "express";
import User from "../modules/user.mjs";
import HttpCodes from "../modules/httpErrorCodes.mjs";


const USER_API = express.Router();

export const users = [];

USER_API.get('/:id', (req, res) => {
    // Tip: All the information you need to get the id part of the request can be found in the documentation 
    // https://expressjs.com/en/guide/routing.html (Route parameters)
    /// TODO: 
    // Return user object
})

USER_API.get('/', (req, res) => {
    res.status(HttpCodes.SuccesfullRespons.Ok).json(users)
})

let nextUserId = 1
USER_API.post('/', (req, res, next) => {

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
            res.status(HttpCodes.SuccesfullRespons.Ok).send("Bruker med id " + user.id + " ble registrert").end();
        } else {
            res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Bruker ekisterer allerede").end();
        }

    } else {
        res.status(HttpCodes.ClientSideErrorRespons.BadRequest).send("Mangler data felt").end();
    }

});

USER_API.put('/:id', (req, res) => {
    const userIdToUpdate = parseInt(req.params.id, 10);

    const updatedUserData = req.body;

    const userIndex = users.findIndex(user => user.id === userIdToUpdate);

    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedUserData };

        res.status(HttpCodes.SuccesfullRespons.Ok).end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).end();
    }
});


USER_API.delete('/:id', (req, res) => {
    const userIdToDelete = parseInt(req.params.id, 10);

    const userIndex = users.findIndex(user => user.id === userIdToDelete);

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.status(HttpCodes.SuccesfullRespons.Ok).send("Bruker med id: " + userIdToDelete + " ble slettet").end();
    } else {
        res.status(HttpCodes.ClientSideErrorRespons.NotFound).send("Bruker eksisterer ikke").end();
    }
});


export default USER_API