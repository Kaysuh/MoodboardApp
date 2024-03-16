import DBManager from "./storageHandler.mjs";

class Moodboard {
    constructor() {
        this.name;
        this.images = [];

    }

    async save() {
        if (this.id) {
            try {
                const updateResult = await DBManager.updateMoodboard(this);
                return updateResult.rowCount > 0;
            }
            catch (error) {
                throw error;
            }
        } else {
            await DBManager.createMoodboard(this);
        }
    }

    async getMoodboards() {
        const moodboards = await DBManager.getAllMoodboards()
        return moodboards;
    }

    async getUserMoodboards(userId) {
        const moodboards = await DBManager.getAllUserMoodboards(userId)
        return moodboards;
    }

    async delete() {
        try {
            const deletionResult = await DBManager.deleteMoodboard(this);
            return deletionResult.rowCount > 0;
        }
        catch (error) {
            throw error;
        }
    }

    async searchMoodboards(searchTerm) {
        const moodboards = await DBManager.searchMoodboardsDb(searchTerm)
        return moodboards;
    }
}

export default Moodboard;
