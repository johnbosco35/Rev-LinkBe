const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const adminService = require("../services/admin");
const verifyRole = require("../middleware/verify-role");
const { validateSubjectAllocation } = require("../middleware/validators/user");
const { successResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router.use(verifyRole("admin"));
router.route("/dashboard").get(adminDashboard);
router.route("/profile").get(adminProfile);
router.route("/lessons").get(getAllLessons);
router.route("/lessons/bank").get(getLessonsInBank);
router.route("/lessons/:id/approve").post(approveLesson);
router.route("/lessons/:id/reject").post(rejectLesson);
router
  .route("/subject/allocate")
  .post(validateSubjectAllocation, allocateSubject);
router.route("/subject/allocate/:id").delete(removeSubjectAllocation);

function adminDashboard(req, res, next) {
  adminService
    .adminDashboard()
    .then((result) =>
      successResponse(res, "Dashboard retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function adminProfile(req, res, next) {
  adminService
    .adminProfile()
    .then((result) =>
      successResponse(res, "Profile retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function getAllLessons(req, res, next) {
  adminService
    .getLessons(req)
    .then((result) =>
      successResponse(res, "Lessons retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function approveLesson(req, res, next) {
  adminService
    .approveLesson(req)
    .then((result) => successResponse(res, "Lesson approved successfully"))
    .catch((err) => next(err.message));
}

function rejectLesson(req, res, next) {
  adminService
    .rejectLesson(req)
    .then((result) => successResponse(res, "Lesson rejected successfully"))
    .catch((err) => next(err.message));
}

function allocateSubject(req, res, next) {
  adminService
    .allocateSubject(req)
    .then((result) => successResponse(res, "Subject allocated successfully"))
    .catch((err) => next(err.message));
}

function removeSubjectAllocation(req, res, next) {
  adminService
    .removeSubjectAllocation(req)
    .then((result) => successResponse(res, "Subject allocation removed"))
    .catch((err) => next(err.message));
}

function getLessonsInBank(req, res, next) {
  adminService
    .getLessonsInBank(req)
    .then((result) =>
      successResponse(res, "Lessons retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
