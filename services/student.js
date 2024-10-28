const {
  BadRequestError,
  NotFoundError,
} = require("../middleware/error-handler");
const {
  LessonNote,
  Assignment,
  ClassHistory,
  Announcement,
  Term,
  Session,
  Class,
  Subject,
  Student,
} = require("../model");
const { LessonStatus } = require("../model/lesson-note");

async function studentDashboard(req) {
  const { termId, page = 1, limit = 15 } = req.query;
  const { id } = req;

  const query = {};

  if (termId) {
    query.term = termId;
  }

  const studentEnrolledClasses = await ClassHistory.find({
    student: id,
    ...query,
  });

  const studentEnrolledSubjectIds = studentEnrolledClasses.map(
    (student) => student.subject
  );

  const [uploadedLessons, assignments] = await Promise.all([
    LessonNote.paginate(
      {
        subject: { $in: studentEnrolledSubjectIds },
        status: LessonStatus.APPROVED,
        ...query,
      },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: "subject",
      }
    ),
    Assignment.paginate(
      {
        subject: { $in: studentEnrolledSubjectIds },
        ...query,
      },
      {
        page,
        limit,
        sort: { createdAt: -1 },
        populate: "subject",
      }
    ),
  ]);

  return {
    uploadedLessons: uploadedLessons.docs,
    assignments: assignments.docs,
  };
}

async function studentLessons(req) {
  const { termId, page = 1, limit = 15 } = req.query;
  const { id } = req;

  const query = {};

  if (termId) {
    query.term = termId;
  }

  const studentEnrolledClasses = await ClassHistory.find({
    student: id,
    ...query,
  });

  const studentEnrolledSubjectIds = studentEnrolledClasses.map(
    (student) => student.subject
  );

  return LessonNote.paginate(
    {
      subject: { $in: studentEnrolledSubjectIds },
      status: LessonStatus.APPROVED,
      ...query,
    },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: "subject",
    }
  );
}

async function studentAssignments(req) {
  const { termId, page = 1, limit = 15, assignmentId } = req.query;
  const { id } = req;

  const query = {};
  const assignmentQuery = {};

  if (termId) {
    query.term = termId;
    assignmentQuery.term = termId;
  }

  if (assignmentId) {
    assignmentQuery._id = assignmentId;
  }

  const studentEnrolledClasses = await ClassHistory.find({
    student: id,
    ...query,
  });

  const studentEnrolledSubjectIds = studentEnrolledClasses.map(
    (student) => student.subject
  );

  return Assignment.paginate(
    {
      subject: { $in: studentEnrolledSubjectIds },
      ...assignmentQuery,
    },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: "subject",
    }
  );
}

async function studentAnnouncements(req) {
  const { termId, page = 1, limit = 15 } = req.query;
  const { id } = req;

  const query = {};

  if (termId) {
    query.term = termId;
  }

  const studentEnrolledClasses = await ClassHistory.find({
    student: id,
    ...query,
  });

  const studentEnrolledSubjectIds = studentEnrolledClasses.map(
    (student) => student.subject
  );

  return Announcement.paginate(
    {
      subject: { $in: studentEnrolledSubjectIds },
      ...query,
    },
    {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: "subject",
    }
  );
}

async function enrollClass(req) {
  const { id } = req;
  const { class: classId, session, term, subject } = req.body;

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

  const studentAlreadyEnrolled = await ClassHistory.findOne({
    student: id,
    class: req.body.class,
  });
  if (studentAlreadyEnrolled) {
    throw new BadRequestError("You have already enrolled in this class");
  }

  ClassHistory.create({
    ...req.body,
    student: id,
  });
}

async function updateProfile(req) {
  const body = { ...req.body };

  delete body.email;
  delete body.admissionNo;
  delete body.password;

  const student = await Student.findById(req.id);
  if (!student) {
    throw new NotFoundError("Student not found");
  }

  body.photo = req.file ? req.file.path : student.photo;

  return Student.findByIdAndUpdate(
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
  studentDashboard,
  studentLessons,
  studentAssignments,
  studentAnnouncements,
  enrollClass,
  updateProfile,
};
