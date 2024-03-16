import pg from "pg"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let dbConnectionString;
const SECRET_KEY = process.env.JWT_SECRET;

if (process.env.NODE_ENV === 'production') {
    dbConnectionString = process.env.DB_CONNECTIONSTRING_PROD;
} else {
    dbConnectionString = process.env.DB_CONNECTIONSTRING_DEV;
}

if (!dbConnectionString) {
    throw new Error("Database connection string is missing.");
}

class DBManager {
    #credentials = {};

    constructor(connectionString) {
        this.#credentials = {
            connectionString,
            ssl: (process.env.DB_SSL === "true") ? process.env.DB_SSL : false
        };

    }

    //USER
    async authenticateUser(email, password) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const result = await client.query('SELECT * FROM "public"."Users" WHERE email = $1;', [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
                    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });

                    const userResponse = {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        profilePicture: user.profilePicture,
                        isAdmin: user.isAdmin
                    };
                    return { userResponse, token };
                }
            }
            return null;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw error;
        } finally {
            client.end();
        }
    }

    async getAllUsers() {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const result = await client.query('SELECT * FROM "public"."Users";');
            return result.rows;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        } finally {
            client.end();
        }
    }

    async getUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Users" WHERE id = $1;', [user.id]);
            if (output.rows.length > 0) {
                return output.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        } finally {
            await client.end();
        }
    }


    async updateUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('UPDATE "public"."Users" set "name" = $1, "email" = $2, "password" = $3 WHERE id = $4;', [user.name, user.email, user.pswHash, user.id]);
            return { rowCount: output.rowCount };
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        } finally {
            client.end();
        }

    }

    async deleteUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete FROM "public"."Users"  WHERE id = $1;', [user.id]);
            return { rowCount: output.rowCount };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        } finally {
            client.end();
        }
    }

    async createUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("email", "password", "username", "profilePicture") VALUES($1::Text, $2::Text, $3::Text, $4::Text) RETURNING id;', [user.email, user.pswHash, user.userName, user.profilePicture]);
            if (output.rows.length == 1) {
                user.id = output.rows[0].id;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            client.end();
        }
        return user;
    }

    //MOODBOARD
    async createMoodboard(moodboard) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Moodboards"("name", "images", "user_id") VALUES($1::text, $2::json, $3::integer) RETURNING id;', [moodboard.name, JSON.stringify(moodboard.images), moodboard.userId]);
            if (output.rows.length > 0) {
                return moodboard;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error creating moodboard:', error);
            throw error;
        } finally {
            await client.end();
        }
    }

    async getAllMoodboards() {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Moodboards";');
            return output.rows;
        } catch (error) {
            console.error('Error getting all moodboards:', error);
            throw error;
        } finally {
            client.end();
        }
    }

    async getAllUserMoodboards(userId) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Moodboards" WHERE user_id = $1;', [userId]);
            console.log(userId)
            return output.rows;
        } catch (error) {
            console.error('Error getting users moodboards:', error);
            throw error;
        } finally {
            await client.end();
        }
    }

    async deleteMoodboard(moodboard) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Moodboards"  WHERE id = $1;', [moodboard.id]);
            return { rowCount: output.rowCount };
        } catch (error) {
            console.error('Error deleting moodboards:', error);
            throw error;
        } finally {
            client.end();
        }
    }

    async updateMoodboard(moodboard) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('UPDATE "public"."Moodboards" set "name" = $1, "images" = $2 WHERE id = $3;', [moodboard.name, JSON.stringify(moodboard.images), moodboard.id]);
            return { rowCount: output.rowCount };
        } catch (error) {
            console.error('Error updating moodboard:', error);
            throw error;
        } finally {
            client.end();
        }
    }

    async searchMoodboardsDb(searchTerm) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('SELECT * FROM "public"."Moodboards" WHERE name ILIKE $1;', [`%${searchTerm}%`]);
            return output.rows;
        } catch (error) {
            console.error('Error searching moodboards:', error);
            throw error;
        } finally {
            await client.end();
        }
    }
}

export default new DBManager(dbConnectionString);