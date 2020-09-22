const express = require("express");
const Job = require("../models/job");
const jsonschema = require("jsonschema");
const jobSchema = require("../schemas/job.json");

const { json } = require("express");
const ExpressError = require("../helpers/expressError");

const router = new express.Router();


/** GET / => {jobs: [job, ...]}  */

router.get("/", async function (req, res, next) {
    try {
      const jobs = await Job.findAll(req.query);
      return res.json({ jobs });
    } catch (err) {
      return next(err);
    }
  });
  

/** GET /:handle => {job: jobData}  */

router.get("/:id", async function (req, res, next) {
    try {
      const job = await Job.findOne(req.params.id);
      return res.json({ job });
    } catch (err) {
      return next(err);
    }
  });
  
  /** POST / jobData => {job: jobData}  */

router.post("/", async function (req, res, next) {
    try {
        const result = jsonschema.validate(req.body, jobSchema);
        if(!result.valid){
          let listOfErrors = result.errors.map( error => error.stack);
          let error = new ExpressError(listOfErrors, 400);
          return next(error);
        }
        const job = await Job.create(req.body);
        return res.status(201).json({ job });
    } catch (err) {
      return next(err);
    }
  });

/** PATCH /:id   jobData => {job: jobData}  */

router.patch("/:id", async function (req, res, next) {
    try {
        const result = jsonschema.validate(req.body, jobSchema);
        if(!result.valid){
            console.log("not valid");
            let listOfErrors = result.errors.map( error => error.stack);
            let error = new ExpressError(listOfErrors, 400);
            return next(error);
        }
        const job = await Job.update(req.params.id, req.body);
        return res.json({ job });
    } catch (err) {
        return next(err);
    }
  });
  
/** DELETE / => { message: "Job deleted" }

  */

router.delete("/:id", async function (req, res, next) {
    try {
        await Job.remove(req.params.id);
        return res.json({message: "Job deleted"});
    } catch (err) {
        return next(err);
    }
    });
      


module.exports = router;
