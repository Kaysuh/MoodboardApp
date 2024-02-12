import pg from "pg"
import bcrypt from 'bcrypt';

if (process.env.DB_CONNECTIONSTRING == undefined) {
    throw ("You forgot the db connection string");
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

}


export default new DBManager(process.env.DB_CONNECTIONSTRING);