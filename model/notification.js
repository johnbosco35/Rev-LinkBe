const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const NOTIFICATION_TYPES = {
  ASSIGNMENT: "assignment",
  LESSON_NOTE: "lesson",
  ANNOUNCEMENT: "announcement",
  SUBMISSION: "submission",
};

const NotificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lessonNote: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LessonNote",
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
  },
  announcement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Announcement",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

NotificationSchema.plugin(mongoosePaginate);

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = { Notification, NOTIFICATION_TYPES };
