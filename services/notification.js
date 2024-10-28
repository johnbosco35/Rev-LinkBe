const { NotFoundError } = require("../middleware/error-handler");
const { Notification } = require("../model");

async function getAllNotifications(req) {
  const { page = 1, limit = 15, unread = "true" } = req.query;

  const query = {};

  if (unread === "false") {
    query.isRead = false;
  }

  return Notification.paginate(query, { page, limit });
}

async function addNotification(data) {
  const notification = new Notification(data);

  return notification.save();
}

async function getNotification(req) {
  const { id } = req.params;

  return Notification.findById(id);
}

async function markAsRead(req) {
  const { id } = req.params;

  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
  if (!notification) {
    throw new NotFoundError("No notification found");
  }

  return notification;
}

module.exports = {
  getAllNotifications,
  addNotification,
  getNotification,
  markAsRead,
};
