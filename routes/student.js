const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const studentService = require("../services/student");
const verifyRole = require("../middleware/verify-role");
const { successResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");
const upload = require("../middleware/multer");

dbc();

router.use([jwt, verifyRole("student")]);

router.get("/dashboard", studentDashboard);
router.get("/lessons", studentLessons);
router.get("/assignments", studentAssignments);
router.get("/announcements", studentAnnouncements);
router.post("/enroll", enrollClass);
router.post("/update-profile", upload.single("photo"), updateProfile);

function studentDashboard(req, res, next) {
  studentService
    .studentDashboard(req)
    .then((result) =>
      successResponse(res, "Dashboard retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function studentLessons(req, res, next) {
  studentService
    .studentLessons(req)
    .then((result) =>
      successResponse(res, "Lessons retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function studentAssignments(req, res, next) {
  studentService
    .studentAssignments(req)
    .then((result) =>
      successResponse(res, "Assignments retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function studentAnnouncements(req, res, next) {
  studentService
    .studentAnnouncements(req)
    .then((result) =>
      successResponse(res, "Announcements retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function enrollClass(req, res, next) {
  studentService
    .enrollClass(req)
    .then(() => successResponse(res, "Enrolled successfully"))
    .catch((err) => next(err.message));
}

function updateProfile(req, res, next) {
  studentService
    .updateProfile(req)
    .then((result) =>
      successResponse(res, "Profile updated successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
