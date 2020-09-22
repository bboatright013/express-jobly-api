const app = require("../../app");
const db = require("../../db");
const request = require("supertest");
const Company = require("../../models/company");

describe('companies routes test', function() {
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        await db.query('DELETE FROM jobs');

      });
      
      afterAll(async function () {
        await db.query('DELETE FROM companies');

        await db.end();
      });

    beforeEach(async function() {

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
      
    describe("GET /companies", function() {
        test("should return list of companies",
        async function () {
          const response = await request(app).get('/companies');
          const companies = response.body;
          expect(companies.companies[0].handle).toEqual("ABC");
          expect(companies.companies[0].name).toEqual("Alphabet");
        
        });
    });

    describe("GET /companies/:handle", function() {
        test("should return specific company",
        async function () {
          const response = await request(app).get('/companies/ABC');

          const companies = response.body.company;
          expect(companies.handle).toEqual("ABC");
          expect(companies.name).toEqual("Alphabet");
        
        });
    });

    describe("POST /companies/", function() {
        test("should return company data",
            async function () {
            const response = await request(app).post('/companies')
            .send({
                "handle": "DEF",
                "name" : "Soup",
                "num_employees" : 20,
                "description" : "A finer company",
                "logo_url" : "https://yourlogourl.jpg"
            });
            
            const company = response.body.company;
            expect(company.handle).toEqual("DEF");
            expect(company.name).toEqual("Soup");
         });

        test("should return 2 companies",
            async function () {
            await request(app).post('/companies')
            .send({
                "handle": "DEF",
                "name" : "Soup",
                "num_employees" : 20,
                "description" : "A finer company",
                "logo_url" : "https://yourlogourl.jpg"
            });
            const response = await request(app).get('/companies');
            const companies = response.body;
            expect(companies.companies).toHaveLength(2);
                });
    });

    describe("PATCH /companies/:handle", function() {
        test("should return updated company data",
            async function () {
            const response = await request(app).patch('/companies/ABC')
            .send({
                "name" : "Numberline",
                "num_employees" : 100,
                "description" : "A fine company",
                "logo_url" : "https://mylogourl.jpg"
            });
            const company = response.body.company;
            expect(company.name).toEqual("Numberline");
            expect(company.num_employees).toEqual(100);
         });
    });

    describe("DELETE /companies/:handle", function() {
        test("should delete a company",
        async function () {
          const response = await request(app).delete('/companies/ABC');
          const message = response.body.message;
          expect(message).toEqual("Company deleted");
        });
    });


});
