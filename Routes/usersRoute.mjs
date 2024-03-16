import express, { json, response } from "express";
import User from "../Modules/user.mjs";
import bcrypt from 'bcrypt';
import verifyTokenMiddleware from "../Modules/authorizationHandler.mjs"

const USER_API = express.Router();
USER_API.use(express.json());

USER_API.get('/:id', async (req, res) => {
    try {
        const user = new User();
        const userToGet = await user.getUser(req.params.id);

        if (userToGet) {
            res.json(userToGet);
        } else {
            res.status(404).send({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching user' });
    }
});


USER_API.get('/', verifyTokenMiddleware, async (req, res) => {
    try {
        const user = new User();
        let users = await user.getUsers();

        users = users.filter(user => !user.isAdmin);

        res.sendSuccess(users);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching users' });
    }
});


USER_API.post('/register', async (req, res) => {
    const { userName, email, password, profilePicture } = req.body;

    if (userName != "" && email != "" && password != "") {
        let user = new User();
        user.userName = userName;
        user.email = email;
        user.profilePicture = profilePicture

        user.pswHash = await bcrypt.hash(password, 10)
        let exists = false

        if (!exists) {
            user = await user.save();
            res.sendSuccess(user, 201);
        } else {
            res.sendError(new Error('User already exists'), 400);
        }
    } else {
        res.sendError(new Error('Missing name, email, or password'), 400);
    }
});


USER_API.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (email !== '' && password !== '') {
        const user = await User.authenticate(email, password);
        if (user) {
            res.sendSuccess(user, 200);
        } else {
            res.sendError(new Error('Wrong username or password.'), 400);
        }
    } else {
        res.sendError(new Error('Email and password must not be empty.'), 400);
    }
});

USER_API.put('/:id', verifyTokenMiddleware, async (req, res) => {
    const userIdToUpdate = parseInt(req.params.id, 10);
    const updatedUserData = req.body;
    const userToUpdate = new User();
    userToUpdate.id = userIdToUpdate;
    req.body.pswHash = await bcrypt.hash(req.body.pswHash, 10)
    Object.assign(userToUpdate, updatedUserData);

    try {
        const updateResult = await userToUpdate.save();
        if (updateResult) {
            res.sendSuccess({ message: 'User updated successfully' }, 200);
        } else {
            res.sendError(new Error('User not found'), 404);
        }
    } catch (error) {
        console.error(error);
        res.sendError(new Error('An error occurred while updating the user'), 500);
    }
});

USER_API.delete('/:id', verifyTokenMiddleware, async (req, res) => {
    const userIdToDelete = parseInt(req.params.id, 10)
    const userToDelete = new User();
    userToDelete.id = userIdToDelete

    try {
        await userToDelete.delete();
        res.sendSuccess({ message: 'User deleted successfully' }, 200);
    }
    catch (error) {
        console.error(error);
        res.sendError(new Error('An error occurred while deleting the user'), 500);
    }
});

export default USER_API