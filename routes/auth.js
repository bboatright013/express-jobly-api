const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();

const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../helpers/expressError");



/** POST /login - login: {username, password} => {token} **/

 router.post("/login", async function(req, res, next){
     try{
         let {password, username} = req.body;
         const result = await db.query(`
            SELECT password FROM users
            WHERE username = $1`, 
            [username]);
            if (result.rows.length === 0) {
                throw { message: `There is no user with a username '${username}`, status: 404 }
              };
            if(result.rows[0].password != password){
                throw {  message: `invalid password`, status: 400}
            };
            let token = jwt.sign({username}, SECRET_KEY);
            return res.json({token});
     }catch(error){
         return next(error);
     }
 });


 module.exports = router; 