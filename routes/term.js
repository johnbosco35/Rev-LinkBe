const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const termService = require("../services/term");
const { validateAddTerm } = require("../middleware/validators/term");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router.route("/").get(getAllTerms).post(validateAddTerm, addTerm);
router.route("/:id").get(getTerm).patch(updateTerm);

function getAllTerms(req, res, next) {
  termService
    .getAllTerms(req)
    .then((result) =>
      successResponse(res, "Terms retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function addTerm(req, res, next) {
  termService
    .addTerm(req)
    .then((result) => createdResponse(res, "Term successfully created", result))
    .catch((err) => next(err.message));
}

function updateTerm(req, res, next) {
  termService
    .updateTerm(req)
    .then((result) => successResponse(res, "Term updated successfully", result))
    .catch((err) => next(err.message));
}

function getTerm(req, res, next) {
  termService
    .getTerm(req)
    .then((result) =>
      successResponse(res, "Term retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
