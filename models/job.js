const db = require("../db");

/** Collection of related methods for jobs.
 * GET /jobs => returns a list of job objects
 * GET /jobs/:id => returns a single job
 * POST /jobs => creates a new job, requires admin
 * PATCH /jobs/:id => updates a job, requires admin
 * DELETE /jobs/:id => deletes a job, requires admin
 */

class Job {

  /** Return array of all jobs :
   *
   * => {jobs: [job, ...]}
   *
   * */

  static async findAll(search, min_salary = 0, min_equity = 0) {

    if(search.search == undefined){
        const allJobs = await db.query(
            `SELECT id,
                    title,
                    salary,
                    equity,
                    company_handle,
                    date_posted
                    FROM jobs 
                    WHERE salary > $1 AND equity > $2
                    ORDER BY title`,[min_salary, min_equity]);
        return allJobs.rows;
        }
    else {
        const allJobs = await db.query(
            `SELECT id,
            title,
            salary,
            equity,
            company_handle,
            date_posted
            FROM jobs 
            WHERE title LIKE '%${search.search}%'
            AND salary > $1 AND equity > $2
            ORDER BY title`,[min_salary, min_equity]);
        return allJobs.rows;
    }

  }


  /** given an id, return job with that id:
   *
   * => {job: jobData}
   *
   **/

  static async findOne(id) {
    const job = await db.query(
        `SELECT id,
        title,
        salary,
        equity,
        company_handle,
        date_posted
        FROM jobs  
        WHERE id = $1
        `, [id]);

    if (job.rows.length === 0) {
      throw { message: `There is no job with id of '${id}`, status: 404 }
    }
    return job.rows[0];
  }


  /** create a job in database from data, return that job:
   *
   * {job: jobData}
   *
   * => {job: jobData}
   *
   * */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO jobs (
        title,
        salary,
        equity,
        company_handle) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id,
         title,
         salary,
         equity,
         company_handle,
         date_posted`,
      [
        data.title,
        data.salary,
        data.equity,
        data.company_handle
      ]
    );

    return result.rows[0];
  }

  /** Update job with matching ID, return updated job.

   * { title, salary, equity}
   *
   * => {id, title, salary, equity, company_handle, date_posted}
   *
   * */

  static async update(id, data) {
    const result = await db.query(
        `UPDATE jobs SET
          title = ($1),
          salary = ($2),
          equity = ($3)
           WHERE id = $4
           RETURNING id,
           title,
           salary,
           equity,
           company_handle,
           date_posted`,
        [
          data.title,
          data.salary,
          data.equity,
          id
        ]
      );

    if (result.rows.length === 0) {
      throw { message: `There is no job with id of '${id}`, status: 404 }
    }

    return result.rows[0];
  }

  /** remove job with matching id. */

  static async remove(id) {
    const result = await db.query(
      `DELETE FROM jobs 
         WHERE id = $1 
         RETURNING id`,
        [id]);

    if (result.rows.length === 0) {
      throw { message: `There is no job with id of '${id}`, status: 404 }
    }
  }
}


module.exports = Job;
