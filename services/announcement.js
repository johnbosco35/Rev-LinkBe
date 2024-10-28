const { NotFoundError } = require("../middleware/error-handler");
const {
  Announcement,
  LessonNote,
  Class,
  Subject,
  ClassHistory,
} = require("../model");
const { addNotification } = require("./notification");
const { NOTIFICATION_TYPES } = require("../model/notification");
const logger = require("../helper/logger");

async function getAllAnnouncements(req) {
  const { page = 1, limit = 15, classId, subjectId } = req.query;

  let condition = {};

  if (classId) {
    condition.class = classId;
  }

  if (subjectId) {
    condition.subject = subjectId;
  }

  const announcements = Announcement.paginate(condition, {
    page,
    limit,
    populate: [
      {
        path: "class",
        select: "name",
      },
      {
        path: "subject",
        select: "title",
      },
      {
        path: "lessonNote",
        select: "topic",
      },
    ],
    sort: { createdAt: -1 },
  });

  return announcements;
}

async function getAnnouncement(req) {
  const announcement = await Announcement.findById(req.params.id).populate([
    {
      path: "lessonNote",
      select: "topic week content",
    },
    {
      path: "subject",
      select: "title",
    },
  ]);
  if (!announcement) {
    throw new NotFoundError("No announcement found");
  }

  return announcement;
}

async function addAnnouncement(req) {
  const { lessonNote, subject, class: classId, title } = req.body;

  if (!title && !lessonNote) {
    throw new NotFoundError(
      "The announcement needs either a title or a lesson note"
    );
  }

  if (lessonNote) {
    const classLessonNote = await LessonNote.findById(lessonNote);
    if (!classLessonNote) {
      throw new NotFoundError("No lesson note found");
    }
  }

  const classSubject = await Subject.findById(subject);
  if (!classSubject) {
    throw new NotFoundError("No subject found");
  }

  const classExists = await Class.findById(classId);
  if (!classExists) {
    throw new NotFoundError("No class found");
  }

  const attachments = req.files
    ? req.files.map((file) => {
        return { name: file.originalname, url: file.path, size: file.size };
      })
    : [];

  const announcement = await Announcement.create({ ...req.body, attachments });

  const subjectStudents = await ClassHistory.find({
    subject,
    class: classId,
  })
    .populate("student")
    .select("student");

  const students = subjectStudents.map((allocation) => allocation.student);

  students.forEach((std) => {
    addNotification({
      message: `A new announcement has been posted under ${classSubject.title}`,
      type: NOTIFICATION_TYPES.ANNOUNCEMENT,
      recipient: std._id,
      announcement: announcement._id,
    })
      .then(() => logger.info("Notification added"))
      .catch((error) => logger.error(error.message));
  });

  return announcement;
}

async function updateAnnouncement(req) {
  const { lessonNote, subject, class: classId } = req.body;

  if (lessonNote) {
    const lessonNoteExists = await LessonNote.findById(lessonNote);
    if (!lessonNoteExists) {
      throw new NotFoundError("No lesson note found");
    }
  }

  if (subject) {
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      throw new NotFoundError("No subject found");
    }
  }

  if (classId) {
    const classExists = await Class.findById(classId);
    if (!classExists) {
      throw new NotFoundError("No class found");
    }
  }

  const existingAnnouncement = await Announcement.findById(req.params.id);
  if (!existingAnnouncement) {
    throw new NotFoundError("No announcement found");
  }

  const newAttachments = req.files
    ? req.files.map((file) => {
        return { name: file.originalname, url: file.path, size: file.size };
      })
    : existingAnnouncement.attachments;

  let attachments = [];

  if (req.body.attachments) {
    const retainedAttachments = req.body.attachments;
    attachments = [...retainedAttachments, ...newAttachments];
  } else {
    attachments = newAttachments;
  }

  return Announcement.findByIdAndUpdate(
    req.params.id,
    { ...req.body, attachments },
    { new: true }
  );
}

async function deleteAnnouncement(req) {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) {
    throw new NotFoundError("No announcement found");
  }
}

module.exports = {
  addAnnouncement,
  getAnnouncement,
  updateAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement,
};
