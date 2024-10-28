const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const classService = require("../services/class");
const { validateAddClass } = require("../middleware/validators/class");
const verifyRole = require("../middleware/verify-role");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router
  .route("/")
  .get(getAllClasses)
  .post([validateAddClass, verifyRole("admin")], addClass);
router.route("/:id").get(getClass).patch(verifyRole("admin"), updateClass);

function getAllClasses(req, res, next) {
  classService
    .getAllClasses(req)
    .then((result) =>
      successResponse(res, "Classes retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function addClass(req, res, next) {
  classService
    .addClass(req)
    .then((result) =>
      createdResponse(res, "Class successfully created", result)
    )
    .catch((err) => next(err.message));
}

function getClass(req, res, next) {
  classService
    .getClass(req)
    .then((result) =>
      successResponse(res, "Class retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function updateClass(req, res, next) {
  classService
    .updateClass(req)
    .then((result) =>
      successResponse(res, "Class updated successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
