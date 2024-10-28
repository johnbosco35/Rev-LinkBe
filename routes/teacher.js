const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const teacherService = require("../services/teacher");
const verifyRole = require("../middleware/verify-role");
const { successResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");
const upload = require("../middleware/multer");

dbc();

router.use([jwt, verifyRole("teacher")]);

router.get("/dashboard", teacherDashboard);
router.get("/subjects", teacherSubjects);
router.get("/lessons", getAllLessons);
router.get("/lessons/bank", lessonsInBank);
router.get("/assignments", assignments);
router.get("/announcements", announcements);
router.post("/enroll-students", verifyRole("teacher", "admin"), enrollStudents);
router.get("/students", students);
router.post("/update-profile", upload.single("photo"), updateProfile);

function teacherDashboard(req, res, next) {
  teacherService
    .teacherDashboard(req)
    .then((result) =>
      successResponse(res, "Dashboard retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function teacherSubjects(req, res, next) {
  teacherService
    .subjects(req)
    .then((result) =>
      successResponse(res, "Subjects retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function lessonsInBank(req, res, next) {
  teacherService
    .lessonsInBank(req)
    .then((result) =>
      successResponse(res, "Bank lessons retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function assignments(req, res, next) {
  teacherService
    .assignments(req)
    .then((result) =>
      successResponse(res, "Assignments retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function getAllLessons(req, res, next) {
  teacherService
    .getAllLessons(req)
    .then((result) =>
      successResponse(res, "Lessons retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function announcements(req, res, next) {
  teacherService
    .announcements(req)
    .then((result) =>
      successResponse(res, "Announcements retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function enrollStudents(req, res, next) {
  teacherService
    .enrollStudents(req)
    .then((result) =>
      successResponse(res, "Students enrolled successfully", result)
    )
    .catch((err) => next(err.message));
}

function students(req, res, next) {
  teacherService
    .students(req)
    .then((result) =>
      successResponse(res, "Students retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function updateProfile(req, res, next) {
  teacherService
    .updateProfile(req)
    .then((result) =>
      successResponse(res, "Teacher updated successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
