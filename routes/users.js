const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const userService = require("../services/user");
const {
  email_exists,
  validateAddStudent,
  validateAddTeacher,
  validatePrivilege,
} = require("../middleware/validators/user");
const verifyRole = require("../middleware/verify-role");
const upload = require("../middleware/multer");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router.route("/").get(getAllUsers);
router.route("/admins").post(upload.single("photo"), addAdmin);
router
  .route("/admins/:id")
  .get(getAdminById)
  .patch(verifyRole("admin"), updateAdmin);
router
  .route("/admin/:id/privilege")
  .patch(validatePrivilege, updateAdminPrivilege);

router
  .route("/teachers")
  .get(getAllTeachers)
  .post(
    [
      email_exists,
      verifyRole("admin"),
      validateAddTeacher,
      upload.single("photo"),
    ],
    addTeacher
  );
router.post(
  "/teachers/bulk",
  [verifyRole("admin"), upload.single("teachers")],
  addTeacherBulk
);
router
  .route("/teachers/:id")
  .get(getTeacherById)
  .patch(verifyRole("admin"), updateTeacher);

router
  .route("/students")
  .get(getAllStudents)
  .post(
    [
      email_exists,
      verifyRole("admin"),
      validateAddStudent,
      upload.single("photo"),
    ],
    addStudent
  );
router.post(
  "/students/bulk",
  [verifyRole("admin"), upload.single("students")],
  addStudentBulk
);
router
  .route("/students/:id")
  .get(getStudentById)
  .patch(verifyRole("admin"), updateStudent);

function getAllUsers(req, res, next) {
  userService
    .getAllUsers(req)
    .then((result) =>
      successResponse(res, "Users retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function addAdmin(req, res, next) {
  userService
    .addAdmin(req)
    .then((result) =>
      createdResponse(res, "Admin successfully created", result)
    )
    .catch((err) => next(err.message));
}

function updateAdmin(req, res, next) {
  userService
    .updateAdmin(req)
    .then((result) =>
      successResponse(res, "Admin updated successfully", result)
    )
    .catch((err) => next(err.message));
}

function getAdminById(req, res, next) {
  userService
    .getAdminById(req)
    .then((result) =>
      successResponse(res, "Admin retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function updateAdminPrivilege(req, res, next) {
  userService
    .updateAdminPrivilege(req)
    .then((result) =>
      successResponse(res, "Admin privilege updated successfully", result)
    )
    .catch((err) => next(err.message));
}

function addTeacher(req, res, next) {
  userService
    .addTeacher(req)
    .then((result) =>
      createdResponse(res, "Teacher successfully created", result)
    )
    .catch((err) => next(err.message));
}

function addTeacherBulk(req, res, next) {
  userService
    .addTeacherBulk(req)
    .then((result) =>
      createdResponse(res, "Teachers successfully created", result)
    )
    .catch((err) => next(err.message));
}

function getAllTeachers(req, res, next) {
  userService
    .getAllTeachers(req)
    .then((result) =>
      successResponse(res, "Teachers retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function getTeacherById(req, res, next) {
  userService
    .getTeacherById(req)
    .then((result) =>
      successResponse(res, "Teacher retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function updateTeacher(req, res, next) {
  userService
    .updateTeacher(req)
    .then((result) =>
      successResponse(res, "Teacher updated successfully", result)
    )
    .catch((err) => next(err.message));
}

function addStudent(req, res, next) {
  userService
    .addStudent(req)
    .then((result) =>
      createdResponse(res, "Student successfully created", result)
    )
    .catch((err) => next(err.message));
}

function addStudentBulk(req, res, next) {
  userService
    .addStudentBulk(req)
    .then((result) =>
      createdResponse(res, "Students successfully created", result)
    )
    .catch((err) => next(err.message));
}

function getAllStudents(req, res, next) {
  userService
    .getAllStudents(req)
    .then((result) =>
      successResponse(res, "Students retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function getStudentById(req, res, next) {
  userService
    .getStudentById(req)
    .then((result) =>
      successResponse(res, "Student retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function updateStudent(req, res, next) {
  userService
    .updateStudent(req)
    .then((result) =>
      successResponse(res, "Student updated successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
