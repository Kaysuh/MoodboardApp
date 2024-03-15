import express from "express";
import Moodboard from "../Modules/moodboard.mjs";
import verifyTokenMiddleware from "../Modules/authorizationHandler.mjs"

const MOODBOARD_API = express.Router();

MOODBOARD_API.post('/', verifyTokenMiddleware, async (req, res) => {
    try {
        const { name, images } = req.body;
        const userId = req.user.id

        let moodboard = new Moodboard();
        moodboard.name = name;
        moodboard.images = images;
        moodboard.userId = userId

        await moodboard.save();
        res.status(201).json(moodboard);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error creating moodboard' });
    }
});

MOODBOARD_API.get('/', async (req, res) => {
    const moodboard = new Moodboard();
    const moodboards = await moodboard.getMoodboards();
    res.sendSuccess(moodboards);
});

MOODBOARD_API.get('/user', verifyTokenMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const moodboard = new Moodboard();
        const moodboards = await moodboard.getUserMoodboards(userId);

        res.status(200).json(moodboards);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching user moodboards' });
    }
});

MOODBOARD_API.delete('/:id', async (req, res) => {
    const moodboardIdToDelete = parseInt(req.params.id, 10)
    const moodboardToDelete = new Moodboard();
    moodboardToDelete.id = moodboardIdToDelete

    try {
        await moodboardToDelete.delete();
        res.sendSuccess({ message: 'Moodboard deleted successfully' }, 200);
    }
    catch (error) {
        console.error(error);
        res.sendError(new Error('An error occurred while deleting the moodboard'), 500);
    }
});

MOODBOARD_API.put('/:id', verifyTokenMiddleware, async (req, res) => {
    const moodboardIdToUpdate = parseInt(req.params.id, 10);
    const updatedmoodboardData = req.body;
    const moodboardToUpdate = new Moodboard();
    moodboardToUpdate.id = moodboardIdToUpdate;
    moodboardToUpdate.name = updatedmoodboardData.name;
    moodboardToUpdate.images = updatedmoodboardData.images;

    try {
        const updateResult = await moodboardToUpdate.save();
        if (updateResult) {
            res.sendSuccess({ message: 'Moodboard updated successfully' }, 200);
        } else {
            res.sendError(new Error('Moodboard not found'), 404);
        }
    } catch (error) {
        console.error(error);
        res.sendError(new Error('An error occurred while updating the moodboard'), 500);
    }
});


export default MOODBOARD_API;
