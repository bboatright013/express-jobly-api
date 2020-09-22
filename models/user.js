const db = require("../db");

/** Collection of related methods for books. */

class User {

  /** Return array of users data:
   *
   * => {users: [{username, first_name, last_name, email}, ...]}
   *
   * */

  static async findAll() {
        const allUsers = await db.query(
            `SELECT username,
                    password,
                    first_name,
                    last_name,
                    email,
                    photo_url,
                    is_admin
                FROM users 
                ORDER BY username`);
        return allUsers.rows;
    }

  /** given a username, return user data with that username:
   *
   * => {user: {username, first_name, last_name, email, photo_url}}
   *
   **/

  static async findOne(username) {
    const user = await db.query(
        `SELECT username,
        password,
        first_name,
        last_name,
        email,
        photo_url,
        is_admin
        FROM users
        WHERE username = $1
        `, [username]);

    if (user.rows.length === 0) {
      throw { message: `There is no user with username '${username}`, status: 404 }
    }
    return user.rows[0];
  }

  /** create a user in database from data, return user data:
   *
   * {username, password, first_name, last_name, email, photo_url}
   *
   * => {username, first_name, last_name, email, photo_url}
   *
   * */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO users (
        username,
        password,
        first_name,
        last_name,
        email,
        photo_url) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING username,
         first_name,
         last_name,
         email,
         photo_url,
         is_admin`,
      [
        data.username,
        data.password,
        data.first_name,
        data.last_name,
        data.email,
        data.photo_url,
      ]
    );

    return result.rows[0];
  }

  /** Update data with matching username to data, return updated user.

   * {username, password, first_name, last_name, email, photo_url}
   *
   * => {username, first_name, last_name, email, photo_url}
   *
   * */

  static async update(username, data) {
    const result = await db.query(
        `UPDATE users SET
          first_name = ($1),
          last_name = ($2),
          email = ($3),
          photo_url = ($4),
          password = ($5)
           WHERE username = $6
           RETURNING username,
           first_name,
           last_name,
           email,
           photo_url`,
        [
          data.first_name,
          data.last_name,
          data.email,
          data.photo_url,
          data.password,
          username
        ]
      );
    if (result.rows.length === 0) {
      throw { message: `There is no user with a username '${username}`, status: 404 }
    }
    return result.rows[0];
  }

  /** remove book with matching isbn. Returns undefined. */

  static async remove(username) {
    const result = await db.query(
      `DELETE FROM users 
         WHERE username = $1 
         RETURNING username`,
        [username]);
    if (result.rows.length === 0) {
      throw { message: `There is no user with username '${username}`, status: 404 }
    }
  }
}


module.exports = User;
