const app = require("../../app");
const db = require("../../db");
const request = require("supertest");
const Job = require("../../models/job");

describe('jobs routes test', function() {
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await db.query('DELETE FROM companies');
        await db.query(`INSERT INTO companies (
            handle,
            name,
            num_employees,
            description,
            logo_url) 
             VALUES ('ABC', 'Alphabet', '10', 'A fine company', 'https://mylogourl.jpg') 
             RETURNING handle,
             name,
             num_employees,
             description,
             logo_url`);

      });
      
      afterAll(async function () {
        await db.query('DELETE FROM jobs');
        await db.query('DELETE FROM companies');

        await db.end();
      });

    beforeEach(async function() {
        await db.query('DELETE FROM jobs');
        
        await db.query(`INSERT INTO jobs (
            id,
            title,
            salary,
            equity,
            company_handle) 
             VALUES (1, 'Commander', 100000, 0.2, 'ABC') 
             RETURNING id,
             title,
             salary,
             equity,
             company_handle,
             date_posted`);

      });
      
    describe("GET /jobs", function() {
        test("should return list of jobs",
        async function () {
          const response = await request(app).get('/jobs');
          const jobs = response.body;
          expect(jobs.jobs[0].title).toEqual("Commander");
          expect(jobs.jobs[0].salary).toEqual(100000);
        
        });
    });

    describe("GET /jobs/:id", function() {
        test("should return specific job posting",
        async function () {
          const response = await request(app).get('/jobs/1');

          const job = response.body.job;
          expect(job.title).toEqual("Commander");
          expect(job.salary).toEqual(100000);
        
        });
    });

    describe("POST /jobs/", function() {
        test("should return job data",
            async function () {
            const response = await request(app).post('/jobs')
            .send({
                "title": "Master",
                "salary" : 200000,
                "equity" : 0.5,
                "company_handle" : "ABC"
            });
            
            const job = response.body.job;
            expect(job.title).toEqual("Master");
            expect(job.salary).toEqual(200000);
         });

        test("should return 2 jobs",
            async function () {
                await request(app).post('/jobs')
                .send({
                    "title": "Master",
                    "salary" : 200000,
                    "equity" : 0.5,
                    "company_handle" : "ABC"
                });
            const response = await request(app).get('/jobs');
            const jobs = response.body;
            expect(jobs.jobs).toHaveLength(2);
                });
    });

    describe("PATCH /jobs/:id", function() {
        test("should return updated job data",
            async function () {
            const response = await request(app).patch('/jobs/1')
            .send({
                "title" : "Numberline",
                "salary" : 100,
                "equity" : 0.8,
                "company_handle" : "ABC"
            });
            const job = response.body.job;
            expect(job.title).toEqual("Numberline");
            expect(job.salary).toEqual(100);
         });
    });

    describe("DELETE /jobs/:id", function() {
        test("should delete a job",
        async function () {
          const response = await request(app).delete('/jobs/1');
          const message = response.body.message;
          expect(message).toEqual("Job deleted");
        });
    });


});
