const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const {
  validateAddAnnouncement,
} = require("../middleware/validators/announcement");
const announcementService = require("../services/announcement");
const upload = require("../middleware/multer");
const { successResponse, createdResponse } = require("../helper/response");
const jwt = require("../middleware/jwt");
const verifyRole = require("../middleware/verify-role");

dbc();

router.use(jwt);
router
  .route("/")
  .get(getAllAnnouncements)
  .post(
    [
      verifyRole("admin", "teacher"),
      upload.array("attachments[]"),
      validateAddAnnouncement,
    ],
    addAnnouncement
  );
router
  .route("/:id")
  .get(getAnnouncement)
  .post(
    verifyRole("admin", "teacher"),
    upload.array("attachments[]"),
    updateAnnouncement
  )
  .delete(verifyRole("admin", "teacher"), deleteAnnouncement);

function getAllAnnouncements(req, res, next) {
  announcementService
    .getAllAnnouncements(req)
    .then((result) =>
      successResponse(res, "Announcements retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function getAnnouncement(req, res, next) {
  announcementService
    .getAnnouncement(req)
    .then((result) =>
      successResponse(res, "Announcement retrieved successfully", result)
    )
    .catch((err) => next(err.message));
}

function addAnnouncement(req, res, next) {
  announcementService
    .addAnnouncement(req)
    .then((result) =>
      createdResponse(res, "Announcement successfully created", result)
    )
    .catch((err) => next(err.message));
}

function updateAnnouncement(req, res, next) {
  announcementService
    .updateAnnouncement(req)
    .then((result) =>
      successResponse(res, "Announcement updated successfully", result)
    )
    .catch((err) => next(err.message));
}

function deleteAnnouncement(req, res, next) {
  announcementService
    .deleteAnnouncement(req)
    .then(() => successResponse(res, "Announcement deleted successfully"))
    .catch((err) => next(err.message));
}

module.exports = router;
