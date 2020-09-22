const app = require("../../app");
const db = require("../../db");
const request = require("supertest");
const User = require("../../models/user");

describe('users routes test', function() {
    beforeAll(async () => {
        process.env.NODE_ENV = 'test';

      });
      
      afterAll(async function () {
        await db.query('DELETE FROM users');
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
      
    describe("GET /users", function() {
        test("should return list of users",
        async function () {
          const response = await request(app).get('/users');
          const users = response.body.users;
          expect(users[0].username).toEqual("Username");
          expect(users[0].first_name).toEqual("First");
        
        });
    });

    describe("GET /users/:username", function() {
        test("should return specific user",
        async function () {
          const response = await request(app).get('/users/Username');

          const user = response.body.user;
          expect(user.first_name).toEqual("First");
          expect(user.username).toEqual("Username");
        
        });
    });

    describe("POST /users", function() {
        test("should return user data",
            async function () {
            const response = await request(app).post('/users')
            .send({
                "username": "Myname",
                "password" : "Password",
                "first_name" : "First",
                "last_name" : "Last",
                "email" : "myemail@cmail.com"
            });
            
            const status = response.status;
            expect(status).toEqual(201);
         });

        test("should return 2 users",
            async function () {
            await request(app).post('/users')
            .send({
                "username": "Myname",
                "password" : "Password",
                "first_name" : "First",
                "last_name" : "Last",
                "email" : "myemail@cmail.com"
            });
            const response = await request(app).get('/users');
            const users = response.body.users;
            expect(users).toHaveLength(2);
                });
    });

    describe("PATCH /users/:username", function() {
        test("should return updated user data",
            async function () {
            const response = await request(app).patch('/users/Username')
            .send({
                "password" : "Password2",
                "first_name" : "First2",
                "last_name" : "Last2",
                "email" : "otroemail@demail.com"
            });
            const user = response.body.user;
            expect(user.first_name).toEqual("First2");
            expect(user.last_name).toEqual("Last2");
         });
    });

    describe("DELETE /users/:username", function() {
        test("should delete a user",
        async function () {
          const response = await request(app).delete('/users/Username');
          const message = response.body.message;
          expect(message).toEqual("User deleted");
        });
    });


});
