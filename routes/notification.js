const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const jwt = require("../middleware/jwt");
const { successResponse, createdResponse } = require("../helper/response");
const notificationService = require("../services/notification");

dbc();

router.use(jwt);
router.route("/").get(getAllNotifications);
router.route("/:id").get(getNotification).patch(markAsRead);

function getAllNotifications(req, res, next) {
  notificationService
    .getAllNotifications(req)
    .then((result) => successResponse(res, "Notifications retrieved", result))
    .catch((err) => next(err.message));
}

function getNotification(req, res, next) {
  notificationService
    .getNotification(req)
    .then((result) => successResponse(res, "Notification retrieved", result))
    .catch((err) => next(err.message));
}

function markAsRead(req, res, next) {
  notificationService
    .markAsRead(req)
    .then((result) =>
      successResponse(res, "Notification marked as read", result)
    )
    .catch((err) => next(err.message));
}

module.exports = router;
