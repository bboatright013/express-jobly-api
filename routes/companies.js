const express = require("express");
const Company = require("../models/company");
const jsonschema = require("jsonschema");
const companySchema = require("../schemas/company.json");

const { json } = require("express");
const ExpressError = require("../expressError");

const router = new express.Router();