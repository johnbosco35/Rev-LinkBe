const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const authService = require("../services/auth");
const {
  validateLogin,
  validateChangePassword,
} = require("../middleware/validators/user");
const jwt = require("../middleware/jwt");
const { successResponse } = require("../helper/response");

dbc();

router.post("/user-role", getUserRole);
router.post("/admin/login", validateLogin, adminLogin);
router.post("/teacher/login", validateLogin, teacherLogin);
router.post("/student/login", validateLogin, studentLogin);

router.use(jwt);
router.post(
  "/admin/change-password",
  validateChangePassword,
  adminChangePassword
);
router.post(
  "/teacher/change-password",
  validateChangePassword,
  teacherChangePassword
);
router.post(
  "/student/change-password",
  validateChangePassword,
  studentChangePassword
);

function adminLogin(req, res, next) {
  authService
    .adminLogin(req)
    .then((result) => successResponse(res, "Login successful", result))
    .catch((err) => next(err.message));
}

function teacherLogin(req, res, next) {
  authService
    .teacherLogin(req)
    .then((result) => successResponse(res, "Login successful", result))
    .catch((err) => next(err.message));
}

function studentLogin(req, res, next) {
  authService
    .studentLogin(req)
    .then((result) => successResponse(res, "Login successful", result))
    .catch((err) => next(err.message));
}

function adminChangePassword(req, res, next) {
  authService
    .adminChangePassword(req)
    .then((result) => successResponse(res, "Password changed successfully"))
    .catch((err) => next(err.message));
}

function teacherChangePassword(req, res, next) {
  authService
    .teacherChangePassword(req)
    .then((result) => successResponse(res, "Password changed successfully"))
    .catch((err) => next(err.message));
}

function studentChangePassword(req, res, next) {
  authService
    .studentChangePassword(req)
    .then((result) => successResponse(res, "Password changed successfully"))
    .catch((err) => next(err.message));
}

function getUserRole(req, res, next) {
  authService
    .getUserRole(req)
    .then((result) => successResponse(res, "User role retrieved", result))
    .catch((err) => next(err.message));
}

module.exports = router;
