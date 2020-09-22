const app = require("../../app");
const db = require("../../db");
const request = require("supertest");

describe('login test', function() {
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';

      });
      
      afterAll(async function () {
        await db.end();
      });

    beforeEach(async function() {

        await db.query('DELETE FROM users');
        await db.query(`INSERT INTO users (
            username,
            password,
            first_name,
            last_name,
            email
            ) 
             VALUES ('Username', 'Password', 'First', 'Last', 'myemail@bmail.com') 
             RETURNING username,
             first_name,
             last_name,
             email`);

      });
      
    describe("POST /users", function() {
        test("should return token",
        async function () {
          const response = await request(app).post('/login').send({'username': 'Username', 'password' : 'Password'});
          // console.log(response);
          expect(response).toBeTruthy();
        
        });
    });

 

});
