const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const classLevelService = require("../services/class-level");
const {
  validateAddClassLevel,
} = require("../middleware/validators/class-level");
const verifyRole = require("../middleware/verify-role");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router
  .route("/")
  .get(getAllClassLevels)
  .post(validateAddClassLevel, addClassLevel);
router
  .route("/:id")
  .get(verifyRole("admin"), getClassLevel)
  .patch(verifyRole("admin"), updateClassLevel);

function getAllClassLevels(req, res, next) {
  classLevelService
    .getAllClassLevels(req)
    .then((result) =>
      successResponse(res, "Class levels retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function getClassLevel(req, res, next) {
  classLevelService
    .getClassLevel(req)
    .then((result) =>
      successResponse(res, "Class level retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function addClassLevel(req, res, next) {
  classLevelService
    .createClassLevel(req)
    .then((result) =>
      createdResponse(res, "Class level successfully created", result)
    )
    .catch((err) => next(err.message));
}

function updateClassLevel(req, res, next) {
  classLevelService
    .updateClassLevel(req)
    .then((result) =>
      successResponse(res, "Class level updated successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
