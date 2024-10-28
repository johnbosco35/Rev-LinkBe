const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const subjectService = require("../services/subject");
const { validateAddSubject } = require("../middleware/validators/subject");
const verifyRole = require("../middleware/verify-role");
const upload = require("../middleware/multer");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router
  .route("/")
  .get(getSubjects)
  .post(
    upload.single("thumbnail"),
    [verifyRole("admin"), validateAddSubject],
    addSubject
  );
router
  .route("/:id")
  .post(upload.single("thumbnail"), verifyRole("admin"), updateSubject);

function getSubjects(req, res, next) {
  subjectService
    .getSubjects(req)
    .then((result) =>
      successResponse(res, "Subjects retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function addSubject(req, res, next) {
  subjectService
    .addSubject(req)
    .then((result) =>
      createdResponse(res, "Subject successfully created", result)
    )
    .catch((err) => next(err.message));
}

function updateSubject(req, res, next) {
  subjectService
    .updateSubject(req)
    .then((result) =>
      successResponse(res, "Subject updated successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
