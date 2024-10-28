const { NotFoundError } = require("../middleware/error-handler");
const {
  SubjectAllocation,
  LessonNote,
  Assignment,
  Announcement,
  Student,
  Session,
  Term,
  Class,
  ClassHistory,
  Subject,
  Teacher,
} = require("../model");
const { LessonStatus } = require("../model/lesson-note");

async function teacherDashboard(req) {
  const { id } = req;
  const { page = 1, limit = 15 } = req.query;

  const [
    allocatedSubjectCount,
    uploadLessonCount,
    approvedLessons,
    draftedLessons,
  ] = await Promise.all([
    SubjectAllocation.countDocuments({
      teacher: id,
    }),
    LessonNote.countDocuments({
      teacher: id,
    }),
    LessonNote.paginate(
      {
        teacher: id,
        status: LessonStatus.APPROVED,
      },
      {
        page,
        limit,
        populate: "subject",
      }
    ),
    LessonNote.paginate(
      {
        teacher: id,
        status: LessonStatus.DRAFT,
      },
      {
        page,
        limit,
        populate: "subject",
      }
    ),
  ]);

  return {
    allocatedSubjectCount,
    uploadLessonCount,
    approvedLessons: approvedLessons.docs,
    draftedLessons: draftedLessons.docs,
  };
}

async function getAllLessons(req) {
  const { id } = req;
  const { page = 1, limit = 15, subjectId, search, termId } = req.query;

  const query = {};
  const lessonQuery = {};

  if (subjectId) {
    query.subject = subjectId;
  }

  if (termId) {
    lessonQuery.term = termId;
  }

  if (search) {
    lessonQuery.topic = { $regex: search, $options: "i" };
  }

  const allocatedSubjects = await SubjectAllocation.find({
    teacher: id,
    ...query,
  });

  const allocatedSubjectIds = allocatedSubjects.map(
    (subject) => subject.subject
  );

  return LessonNote.paginate(
    {
      subject: { $in: allocatedSubjectIds },
      ...lessonQuery,
    },
    {
      page,
      limit,
      populate: [
        { path: "class", select: "name" },
        { path: "subject", select: "title" },
      ],
      sort: { createdAt: -1 },
    }
  );
}

async function subjects(req) {
  const { id } = req;
  const { page = 1, limit = 15, search } = req.query;

  return await SubjectAllocation.paginate(
    {
      teacher: id,
    },
    {
      page,
      limit,
      populate: [
        {
          path: "subject",
          select: "title",
        },
        {
          path: "class",
          select: "name",
        },
      ],
    }
  );
}

async function assignments(req) {
  const { id } = req;
  const {
    page = 1,
    limit = 15,
    subjectId,
    termId,
    isGroup = false,
    assignmentId,
  } = req.query;

  const query = {};
  const assignmentQuery = {};

  if (subjectId) {
    query.subject = subjectId;
  }

  if (termId) {
    assignmentQuery.term = termId;
  }

  if (assignmentId) {
    assignmentQuery._id = assignmentId;
  }

  const allocatedSubjects = await SubjectAllocation.find({
    teacher: id,
    ...query,
  });

  const allocatedSubjectIds = allocatedSubjects.map(
    (subject) => subject.subject
  );

  return Assignment.paginate(
    {
      subject: { $in: allocatedSubjectIds },
      ...assignmentQuery,
      isGroup,
    },
    {
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
    }
  );
}

async function announcements(req) {
  const { id } = req;
  const {
    page = 1,
    limit = 15,
    subjectId,
    termId,
    isGroup = false,
  } = req.query;

  const query = {};
  const announcementQuery = {};

  if (subjectId) {
    query.subject = subjectId;
  }

  if (termId) {
    announcementQuery.term = termId;
  }

  const allocatedSubjects = await SubjectAllocation.find({
    teacher: id,
    ...query,
  });

  const allocatedSubjectIds = allocatedSubjects.map(
    (subject) => subject.subject
  );

  return Announcement.paginate(
    {
      subject: { $in: allocatedSubjectIds },
      ...announcementQuery,
    },
    {
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
    }
  );
}

async function lessonsInBank(req) {
  const { id } = req;
  const { page = 1, limit = 15, subjectId } = req.query;

  const query = {};

  if (subjectId) {
    query.subject = subjectId;
  }

  const allocatedSubjects = await SubjectAllocation.find({
    teacher: id,
    ...query,
  });

  const allocatedSubjectIds = allocatedSubjects.map(
    (subject) => subject.subject
  );

  return LessonNote.paginate(
    {
      subject: { $in: allocatedSubjectIds },
    },
    {
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
      ],
    }
  );
}

async function enrollStudents(req) {
  const { class: classId, students, session, term, subject } = req.body;

  const sessionExists = await Session.findById(session);
  if (!sessionExists) {
    throw new NotFoundError("Session does not exist");
  }

  const termExists = await Term.findById(term);
  if (!termExists) {
    throw new NotFoundError("Term does not exist");
  }

  const classExists = await Class.findById(classId);
  if (!classExists) {
    throw new NotFoundError("Class does not exist");
  }

  const subjectExists = await Subject.findById(subject);
  if (!subjectExists) {
    throw new NotFoundError("Subject does not exist");
  }

  if (!students.length) {
    throw new NotFoundError("At least one student must be enrolled");
  }

  const studentsNotEnrolled = [];
  const studentsNotExisting = [];

  for (const student of students) {
    const studentExists = await Student.findById(student);
    if (!studentExists) {
      studentsNotExisting.push({
        id: student,
        message: "Student does not exist",
      });

      continue;
    }

    const studentAlreadyEnrolled = await ClassHistory.findOne({
      student,
      session,
      term,
    });
    if (studentAlreadyEnrolled) {
      studentsNotEnrolled.push({
        id: student,
        message: "Student already enrolled",
      });

      continue;
    }

    new ClassHistory({
      student,
      class: classId,
      subject,
      session,
      term,
    }).save();
  }

  return { studentsNotEnrolled, studentsNotExisting };
}

async function students(req) {
  const { id } = req;

  const { page = 1, limit = 15, subjectId, termId } = req.query;

  const allocatedClassQuery = {};
  const query = {};

  if (subjectId) {
    allocatedClassQuery.subject = subjectId;
    query.subject = subjectId;
  }

  if (termId) {
    query.term = termId;
  }

  const allocatedClasses = await SubjectAllocation.find({
    teacher: id,
    ...allocatedClassQuery,
  });

  const allocatedClassIds = allocatedClasses.map((subject) => subject.class);

  return ClassHistory.paginate(
    {
      class: { $in: allocatedClassIds },
      ...query,
    },
    {
      page,
      limit,
      populate: [
        {
          path: "student",
          select: {
            password: 0,
            createdAt: 0,
            updatedAt: 0,
          },
        },
        {
          path: "class",
          select: "name",
        },
      ],
    }
  );
}

async function updateProfile(req) {
  const body = { ...req.body };

  delete body.email;
  delete body.admissionNo;
  delete body.password;

  const teacher = await Teacher.findById(req.id);
  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  body.photo = req.file ? req.file.path : teacher.photo;

  return Teacher.findByIdAndUpdate(
    req.id,
    { $set: body },
    { new: true }
  ).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  });
}

module.exports = {
  teacherDashboard,
  subjects,
  lessonsInBank,
  assignments,
  getAllLessons,
  announcements,
  enrollStudents,
  students,
  updateProfile,
};
