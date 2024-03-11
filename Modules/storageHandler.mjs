import pg from "pg"
import bcrypt from 'bcrypt';

let dbConnectionString;

if (process.env.NODE_ENV === 'production') {
    dbConnectionString = process.env.DB_CONNECTIONSTRING_PROD;
} else {
    dbConnectionString = process.env.DB_CONNECTIONSTRING_DEV;
}

if (!dbConnectionString) {
    throw new Error("Database connection string is missing.");
}

/// TODO: is the structure / design of the DBManager as good as it could be?

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
            const result = await client.query('Select * from "public"."Users" where email = $1;', [email]);
            if (result.rows.length > 0) {
                const user = result.rows[0];
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return user;
                }
            }
            return null;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.end();
        }
    }

    async getAllUsers() {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const result = await client.query('Select * from "public"."Users";');
            return result.rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.end();
        }
    }

    async getUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Select * from "public"."Users" where id = $1;', [user.id]);

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
            const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO Did we update the user?
            return { rowCount: output.rowCount };
        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

    }

    async deleteUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Users"  where id = $1;', [user.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?
            return { rowCount: output.rowCount };
        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }

        return user;
    }

    async createUser(user) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('INSERT INTO "public"."Users"("name", "email", "password") VALUES($1::Text, $2::Text, $3::Text) RETURNING id;', [user.name, user.email, user.pswHash]);
            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.
            if (output.rows.length == 1) {
                // We stored the user in the DB.
                user.id = output.rows[0].id;
            }

        } catch (error) {
            console.error(error);
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end(); // Always disconnect from the database.
        }
        return user;
    }

    //MOODBOARD
    async createMoodboard(moodboard) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const insertQuery = 'INSERT INTO "public"."Moodboards"("name", "images") VALUES($1::text, $2::json) RETURNING id;';
            const values = [moodboard.name, JSON.stringify(moodboard.images)];

            const result = await client.query(insertQuery, values);

            if (result.rows.length > 0) {
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
            const result = await client.query('Select * from "public"."Moodboards";');
            return result.rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            client.end();
        }
    }

    async deleteMoodboard(moodboard) {
        const client = new pg.Client(this.#credentials);

        try {
            await client.connect();
            const output = await client.query('Delete from "public"."Moodboards"  where id = $1;', [moodboard.id]);

            // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
            // Of special intrest is the rows and rowCount properties of this object.

            //TODO: Did the user get deleted?
            return { rowCount: output.rowCount };
        } catch (error) {
            //TODO : Error handling?? Remember that this is a module seperate from your server 
        } finally {
            client.end();
        }

        return moodboard;
    }

    async updateMoodboard(moodboard) {
        const client = new pg.Client(this.#credentials);
    
        try {
            await client.connect();
            const output = await client.query('Update "public"."Moodboards" set "name" = $1, "images" = $2 where id = $3;', [moodboard.name, JSON.stringify(moodboard.images), moodboard.id]);
            return { rowCount: output.rowCount };
        } catch (error) {
            console.error('Error updating moodboard:', error);
            throw error;  
        } finally {
            client.end();
        }
    }
    

}


export default new DBManager(dbConnectionString);