import DBManager from "./storageHandler.mjs";

class User {

  constructor() {
    this.email;
    this.pswHash;
    this.name;
    this.id;
  }

  static async authenticate(email, password) {
    const user = await DBManager.authenticateUser(email, password);
    return user;
  }

  async getUsers() {
    const users = await DBManager.getAllUsers()
    return users;
  }

  async getUser(id) {
    const user = await DBManager.getUser({ id })
    return user;
  }

  async save() {
    if (this.id) {
      try {
        const updateResult = await DBManager.updateUser(this);
        return updateResult.rowCount > 0;
      }
      catch (error) {
        throw error;
      }
    } else {
      await DBManager.createUser(this);
    }
  }

  async delete() {
    try {
      const deletionResult = await DBManager.deleteUser(this);
      return deletionResult.rowCount > 0;
    }
    catch (error) {
      throw error;
    }
  }
}

export default User;