const express = require("express");
const Company = require("../models/company");
const jsonschema = require("jsonschema");
const companySchema = require("../schemas/company.json");
const updateCompanySchema = require("../schemas/updateCompany.json");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth")

const { json } = require("express");
const ExpressError = require("../helpers/expressError");

const router = new express.Router();


/** GET / => {companies: [companyData, ...]}  */

router.get("/", ensureLoggedIn, async function (req, res, next) {
    try {
      const companies = await Company.findAll(req.query);
      return res.json({ companies });
    } catch (err) {
      return next(err);
    }
  });
  

/** GET /:handle => {company: companyData}  */

router.get("/:handle", ensureLoggedIn, async function (req, res, next) {
    try {
      const company = await Company.findOne(req.params.handle);
      return res.json({ company });
    } catch (err) {
      return next(err);
    }
  });
  
  /** POST / companyData => {company: companyData}  */

router.post("/",ensureAdmin, async function (req, res, next) {
    try {
        const result = jsonschema.validate(req.body, companySchema);
        if(!result.valid){
          let listOfErrors = result.errors.map( error => error.stack);
          let error = new ExpressError(listOfErrors, 400);
          return next(error);
        }
        const company = await Company.create(req.body);
        return res.status(201).json({ company });
    } catch (err) {
      return next(err);
    }
  });

/** PATCH /:handle   companyData => {company: companyData}  */

router.patch("/:handle",ensureAdmin, async function (req, res, next) {
    try {
        const result = jsonschema.validate(req.body, updateCompanySchema);
        if(!result.valid){
            let listOfErrors = result.errors.map( error => error.stack);
            let error = new ExpressError(listOfErrors, 400);
            return next(error);
        }
        const company = await Company.update(req.params.handle, req.body);
        return res.json({ company });
    } catch (err) {
        return next(err);
    }
  });
  
/** DELETE / => {company: companyData}  */

router.delete("/:handle",ensureAdmin, async function (req, res, next) {
    try {
        await Company.remove(req.params.handle);
        return res.json({message: "Company deleted"});
    } catch (err) {
        return next(err);
    }
    });
      


module.exports = router;
