const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const sessionService = require("../services/session");
const { validateAddSession } = require("../middleware/validators/session");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router.route("/").get(getAllSessions).post(validateAddSession, addSession);
router.route("/:id").get(getSession).patch(updateSession);

function getAllSessions(req, res, next) {
  sessionService
    .getAllSessions(req)
    .then((result) =>
      successResponse(res, "Sessions retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function getSession(req, res, next) {
  sessionService
    .getSession(req)
    .then((result) =>
      successResponse(res, "Session retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function addSession(req, res, next) {
  sessionService
    .addSession(req)
    .then((result) =>
      createdResponse(res, "Session successfully created", result)
    )
    .catch((err) => next(err.message));
}

function updateSession(req, res, next) {
  sessionService
    .updateSession(req)
    .then((result) =>
      successResponse(res, "Session updated successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
