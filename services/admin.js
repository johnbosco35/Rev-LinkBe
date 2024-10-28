const {
  Student,
  Teacher,
  LessonNote,
  Note,
  Class,
  Term,
  Subject,
  Admin,
  SubjectAllocation,
} = require("../model");
const {
  NotFoundError,
  BadRequestError,
} = require("../middleware/error-handler");
const { LessonStatus } = require("../model/lesson-note");

async function adminDashboard() {
  const [totalStudents, totalTeachers, totalUploadedLessons] =
    await Promise.all([
      Student.countDocuments(),
      Teacher.countDocuments(),
      LessonNote.countDocuments(),
    ]);

  return {
    totalStudents,
    totalTeachers,
    totalUploadedLessons,
  };
}

async function adminProfile() {
  const [totalAdmin, adminUsers] = await Promise.all([
    Admin.countDocuments(),
    Admin.find().select({
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    }),
  ]);

  return {
    totalAdmin,
    adminUsers,
  };
}

async function getLessons(req) {
  const { search, classId, subjectId, termId } = req.query;

  let where = {};

  if (search) {
    where.topic = { $regex: search, $options: "i" };
  }

  if (classId) {
    where.class = classId;
  }

  if (subjectId) {
    where.subject = subjectId;
  }

  if (termId) {
    where.term = termId;
  }

  return LessonNote.paginate(where, {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    populate: [
      {
        path: "class",
        select: "name",
      },
      {
        path: "subject",
        select: "title",
      },
    ],
  });
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

  const attachments = req.files?.attachments
    ? req.files.attachments.map((file) => file.path)
    : existingLesson.attachments;
  const videoUrl = req.files?.video
    ? req.files.video[0].path
    : existingLesson.videoUrl;

  return LessonNote.findByIdAndUpdate(
    req.params.id,
    { ...req.body, attachments, videoUrl },
    { new: true }
  );
}

async function approveLesson(req) {
  const { id } = req.params;

  const lesson = await LessonNote.findByIdAndUpdate(
    id,
    {
      status: LessonStatus.APPROVED,
    },
    { new: true }
  );
  if (!lesson) {
    throw new NotFoundError("No lesson found");
  }

  return lesson;
}

async function rejectLesson(req) {
  const { id } = req.params;

  const lesson = await LessonNote.findByIdAndUpdate(
    id,
    {
      status: LessonStatus.REJECTED,
    },
    { new: true }
  );
  if (!lesson) {
    throw new NotFoundError("No lesson found");
  }

  return lesson;
}

async function allocateSubject(req) {
  const { subject, teacher, class: classId } = req.body;

  const subjectExists = await Subject.findById(subject);
  if (!subjectExists) {
    throw new NotFoundError("No subject found");
  }

  const teacherExists = await Teacher.findById(teacher);
  if (!teacherExists) {
    throw new NotFoundError("No teacher found");
  }

  const classExists = await Class.findById(classId);
  if (!classExists) {
    throw new NotFoundError("No class found");
  }

  const teacherAlreadyAllocatedToSubjectUnderClass =
    await SubjectAllocation.findOne({
      teacher,
      class: classId,
      subject,
    });
  if (teacherAlreadyAllocatedToSubjectUnderClass) {
    throw new BadRequestError(
      "Teacher already allocated to subject under class"
    );
  }

  return SubjectAllocation.create({
    subject,
    teacher,
    class: classId,
  });
}

async function removeSubjectAllocation(req) {
  const { id } = req.params;

  const allocation = await SubjectAllocation.findByIdAndDelete(id);
  if (!allocation) {
    throw new NotFoundError("No allocation found");
  }

  return allocation;
}

async function getLessonsInBank(req) {
  const { search, class: classId, subject } = req.query;

  let where = {};

  if (search) {
    where.topic = { $regex: search, $options: "i" };
  }

  if (classId) {
    where.classLevel = classId;
  }

  if (subject) {
    where.subject = subject;
  }

  return Note.paginate(where, {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    populate: [
      {
        path: "class",
        select: "name",
      },
      {
        path: "subject",
        select: "title",
      },
    ],
  });
}

module.exports = {
  adminDashboard,
  adminProfile,
  getLessons,
  updateLesson,
  approveLesson,
  rejectLesson,
  allocateSubject,
  removeSubjectAllocation,
  getLessonsInBank,
};
