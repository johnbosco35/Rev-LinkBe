const { NotFoundError } = require("../middleware/error-handler");
const {
  LessonNote,
  Subject,
  Term,
  Class,
  Note,
  ClassHistory,
} = require("../model");
const mongoose = require("mongoose");
const { getVideoDurationInSeconds } = require("get-video-duration");
const { addNotification } = require("./notification");
const { NOTIFICATION_TYPES } = require("../model/notification");

async function getLesson(req) {
  const { id } = req.params;

  const { classId, subjectId } = req.query;

  const [lesson, groupedLessonsByWeeks] = await Promise.all([
    LessonNote.findOne(id).populate([
      {
        path: "subject",
        select: "title",
      },
      {
        path: "class",
        select: "name",
      },
      {
        path: "teacher",
        select: {
          password: 0,
          createdAt: 0,
          updatedAt: 0,
        },
      },
      {
        path: "assignments",
        select: {
          term: 0,
          subject: 0,
          class: 0,
        },
        options: {
          sort: { createdAt: -1 },
        },
        populate: [
          {
            path: "groups",
            populate: {
              path: "students",
              select: {
                password: 0,
                createdAt: 0,
                updatedAt: 0,
              },
            },
          },
          {
            path: "submission",
            options: {
              sort: { createdAt: -1 },
            },
          },
        ],
      },
      {
        path: "announcements",
      },
    ]),
    LessonNote.aggregate([
      {
        $match: {
          class: new mongoose.Types.ObjectId(classId),
          subject: new mongoose.Types.ObjectId(subjectId),
        },
      },
      {
        $group: {
          _id: "$week",
          lessons: { $push: "$$ROOT" },
        },
      },
      {
        $sort: { _id: -1 },
      },
    ]),
  ]);

  if (!lesson) {
    throw new NotFoundError("No lesson found");
  }

  return {
    lesson,
    lessonsByWeeks: groupedLessonsByWeeks,
  };
}

async function addLesson(req) {
  const {
    topic,
    subject,
    content,
    term,
    week,
    class: classId,
    teacher,
  } = req.body;

  const attachments = req.files["attachments[]"]
    ? req.files["attachments[]"].map((file) => {
        return {
          name: file.originalname,
          url: file.path,
          size: file.size,
        };
      })
    : [];

  let videoUrl;
  videoUrl = req.files.video
    ? {
        name: req.files.video[0].originalname,
        url: req.files.video[0].path,
        size: req.files.video[0].size,
      }
    : null;

  if (videoUrl) {
    const duration = await getVideoDurationInSeconds(videoUrl.url);
    videoUrl = { ...videoUrl, durationInSeconds: duration };
  }

  const lessonClass = await Class.findById(classId);
  if (!lessonClass) {
    throw new NotFoundError("No class found");
  }

  const termExists = await Term.findById(term);
  if (!termExists) {
    throw new NotFoundError("No term found");
  }

  const classSubject = await Subject.findById(subject);
  if (!classSubject) {
    throw new NotFoundError("No subject found");
  }

  const lesson = await LessonNote.create({
    topic,
    class: classId,
    subject,
    content,
    term,
    week,
    attachments,
    videoUrl,
    teacher: teacher || req.id,
  });

  const subjectStudents = await ClassHistory.find({
    subject,
    class: classId,
  })
    .populate("student")
    .select("student");

  const students = subjectStudents.map((allocation) => allocation.student);

  students.forEach((student) => {
    addNotification({
      message: `A new lesson on ${topic} has been uploaded under ${classSubject.title}`,
      type: NOTIFICATION_TYPES.LESSON_NOTE,
      recipient: student._id,
      lessonNote: lesson._id,
    })
      .then(() => logger.info("Notification added"))
      .catch((error) => logger.error(error.message));
  });

  Note.create({
    subject,
    class: classId,
    topic,
    content,
    term,
    week,
    attachments,
    videoUrl,
  });

  return lesson;
}

async function copyLessonFromBank(req) {
  const {
    topic,
    subject,
    content,
    term,
    week,
    class: classId,
    teacher,
  } = req.body;

  const newAttachments = req.files["attachments[]"]
    ? req.files["attachments[]"].map((file) => file.path)
    : [];
  const videoUrl = req.files.video
    ? req.files.video[0].path
    : req.body.video || null;

  let attachments = [];

  if (req.body.attachments) {
    const retainedAttachments = req.body.attachments;
    attachments = [...retainedAttachments, ...newAttachments];
  } else {
    attachments = newAttachments;
  }

  const lessonClass = await Class.findById(classId);
  if (!lessonClass) {
    throw new NotFoundError("No class found");
  }

  const termExists = await Term.findById(term);
  if (!termExists) {
    throw new NotFoundError("No term found");
  }

  const subjectExists = await Subject.findById(subject);
  if (!subjectExists) {
    throw new NotFoundError("No subject found");
  }

  return new LessonNote({
    topic,
    class: classId,
    subject,
    content,
    term,
    week,
    attachments,
    videoUrl,
    teacher: teacher || req.id,
  }).save();
}

async function updateLesson(req) {
  const { subject, term, class: classId } = req.body;

  if (classId) {
    const lessonClass = await Class.findById(classId);
    if (!lessonClass) {
      throw new NotFoundError("No class found");
    }
  }

  if (term) {
    const termExists = await Term.findById(term);
    if (!termExists) {
      throw new NotFoundError("No term found");
    }
  }

  if (subject) {
    const subjectExists = await Subject.findById(subject);
    if (!subjectExists) {
      throw new NotFoundError("No subject found");
    }
  }

  const existingLesson = await LessonNote.findById(req.params.id);
  if (!existingLesson) {
    throw new NotFoundError("No lesson found");
  }

  const newAttachments = req.files["attachments[]"]
    ? req.files["attachments[]"].map((file) => {
        return {
          name: file.originalname,
          url: file.path,
          size: file.size,
        };
      })
    : existingLesson.attachments;

  let videoUrl;
  videoUrl = req.files.video
    ? {
        name: req.files.video[0].originalname,
        url: req.files.video[0].path,
        size: req.files.video[0].size,
      }
    : existingLesson.videoUrl;

  if (req.files.video) {
    const duration = await getVideoDurationInSeconds(videoUrl.url);
    videoUrl = { ...videoUrl, durationInSeconds: duration };
  }

  let attachments = [];

  if (req.body.attachments) {
    const retainedAttachments = req.body.attachments;
    attachments = [...retainedAttachments, ...newAttachments];
  } else {
    attachments = newAttachments;
  }

  return LessonNote.findByIdAndUpdate(
    req.params.id,
    { ...req.body, attachments, videoUrl },
    { new: true }
  );
}

module.exports = {
  getLesson,
  addLesson,
  updateLesson,
  copyLessonFromBank,
};
