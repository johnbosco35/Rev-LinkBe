const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const {
  validateAddLessonNote,
} = require("../middleware/validators/lesson-note");
const upload = require("../middleware/multer");
const lessonService = require("../services/lesson");
const verifyRole = require("../middleware/verify-role");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");

dbc();

router.use(jwt);
router.route("/").post(
  [
    verifyRole("admin", "teacher"),
    upload.fields([
      {
        name: "attachments[]",
        maxCount: 10,
      },
      {
        name: "video",
        maxCount: 1,
      },
    ]),
    validateAddLessonNote,
  ],
  addLesson
);
router.post(
  "/copy",
  [
    verifyRole("admin", "teacher"),
    upload.fields([
      { name: "attachments[]", maxCount: 10 },
      { name: "video", maxCount: 1 },
    ]),
  ],
  copyLessonFromBank
);
router
  .route("/:id")
  .get(getLesson)
  .post(
    verifyRole("admin", "teacher"),
    upload.fields([
      {
        name: "attachments[]",
        maxCount: 10,
      },
      {
        name: "video",
        maxCount: 1,
      },
    ]),
    updateLesson
  );

function addLesson(req, res, next) {
  lessonService
    .addLesson(req)
    .then((result) =>
      createdResponse(res, "Lesson successfully created", result)
    )
    .catch((err) => next(err.message));
}

function getLesson(req, res, next) {
  lessonService
    .getLesson(req)
    .then((result) =>
      successResponse(res, "Lesson retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function updateLesson(req, res, next) {
  lessonService
    .updateLesson(req)
    .then((result) =>
      successResponse(res, "Lesson updated successfully", result)
    )
    .catch((err) => next(err.message));
}

function copyLessonFromBank(req, res, next) {
  lessonService
    .copyLessonFromBank(req)
    .then((result) =>
      successResponse(res, "Lesson copied successfully", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
