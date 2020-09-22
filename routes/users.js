const express = require("express");
const User = require("../models/user");
const jsonschema = require("jsonschema");
const userSchema = require("../schemas/user.json");
const updateUserSchema = require("../schemas/updateUser.json");

const { json } = require("express");
const ExpressError = require("../helpers/expressError");

const router = new express.Router();


/** GET / => {users: [{username, first_name, last_name, email}, ...]}  */

router.get("/", async function (req, res, next) {
    try {
      const users = await User.findAll(req.query);
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  });
  

/** GET /:username => {users: [{username, first_name, last_name, email}, ...]}  */

router.get("/:username", async function (req, res, next) {
    try {
      const user = await User.findOne(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });
  
  /** POST / userdata => {user: user}  */

router.post("/", async function (req, res, next) {
    try {
        const result = jsonschema.validate(req.body, userSchema);
        if(!result.valid){
          let listOfErrors = result.errors.map( error => error.stack);
          let error = new ExpressError(listOfErrors, 400);
          return next(error);
        }
        const user = await User.create(req.body);
        return res.status(201).json({ user });
    } catch (err) {
      return next(err);
    }
  });

/** PATCH /:username   userData => {user: {username, first_name, last_name, email, photo_url}}  */

router.patch("/:username", async function (req, res, next) {
    try {
        const result = jsonschema.validate(req.body, updateUserSchema);
        if(!result.valid){
            console.log("not valid");
            let listOfErrors = result.errors.map( error => error.stack);
            let error = new ExpressError(listOfErrors, 400);
            return next(error);
        }
        const user = await User.update(req.params.username, req.body);
        console.log("valid: ",user);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
  });
  
/** DELETE / => {user : {username, first_name, last_name, email, photo_url}}  */

router.delete("/:username", async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({message: "User deleted"});
    } catch (err) {
        return next(err);
    }
    });
      


module.exports = router;
