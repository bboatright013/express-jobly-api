const db = require("../db");
const ExpressError = require("expressError");

/** Collection of related methods for books. */

class Company {

  /** Return array of company data:
   *
   * => [ {handle, name, num_employees, description, logo_url}, ... ]
   *
   * */

  static async findAll(min_employees = 1, max_employees = 100000000) {
    if(min_employees > max_employees){
        return new ExpressError("minimum employees must be less than max employees", 400);
    }
    const allCompanies = await db.query(
        `SELECT handle,
                name,
                num_employees,
                description,
                logo_url
            FROM companies 
            HAVING COUNT(num_employees) > $1 AND COUNT(num_employees) < $2
            ORDER BY name`, [min_employees, max_employees]);

    return allCompanies.rows;
  }

    /** Return array of company data:
   *
   * => [ {handle, name, num_employees, description, logo_url}, ... ]
   *
   * */

  static async searchAll(search, min_employees = 1, max_employees = 100000000) {
    if(min_employees > max_employees){
        return new ExpressError("minimum employees must be less than max employees", 400);
    }
    const allCompanies = await db.query(
        `SELECT handle,
                name,
                COUNT(num_employees) AS employees,
                description,
                logo_url
            FROM companies 
            WHERE name LIKE '%$1%'
            HAVING COUNT(num_employees) > $2 AND COUNT(num_employees) < $3
            ORDER BY name`, [search, min_employees, max_employees]);

    return allCompanies.rows;
  }

  /** given a handle, return company data with that handle:
   *
   * => { handle, name, num_employees, description, logo_url}
   *
   **/

  static async findOne(handle) {
    const company = await db.query(
        `SELECT handle,
        name,
        num_employees,
        description,
        logo_url
        FROM companies 
        WHERE handle = $1
        `, [handle]);

    if (company.rows.length === 0) {
      throw { message: `There is no company with a handle '${handle}`, status: 404 }
    }

    return company.rows[0];
  }


  /** create company in database from data, return company data:
   *
   * { handle, name, num_employees, description, logo_url}
   *
   * => { handle, name, num_employees, description, logo_url}
   *
   * */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO companies (
        handle,
        name,
        num_employees,
        description,
        logo_url) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING handle,
         name,
         num_employees,
         description,
         logo_url`,
      [
        data.handle,
        data.name,
        data.num_employees,
        data.description,
        data.logo_url
      ]
    );

    return result.rows[0];
  }

  /** Update data with matching ID to data, return updated book.

   * {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * => {isbn, amazon_url, author, language, pages, publisher, title, year}
   *
   * */

  static async update(handle, data) {
    const result = await db.query(
        `UPDATE companies SET
          name = ($1),
          num_employees = ($2),
          description = ($3),
          logo_url = ($4)) 
           VALUES ($1, $2, $3, $4) 
           WHERE handle = $5
           RETURNING handle,
           name,
           num_employees,
           description,
           logo_url`,
        [
          data.name,
          data.num_employees,
          data.description,
          data.logo_url,
          handle
        ]
      );

    if (result.rows.length === 0) {
      throw { message: `There is no company with a handle '${handle}`, status: 404 }
    }

    return result.rows[0];
  }

  /** remove book with matching isbn. Returns undefined. */

  static async remove(handle) {
    const result = await db.query(
      `DELETE FROM companies 
         WHERE handle = $1 
         RETURNING handle`,
        [handle]);

    if (result.rows.length === 0) {
      throw { message: `There is no company with a handle '${handle}`, status: 404 }
    }
  }
}


module.exports = Company;
