const logger = require("../helper/logger");
const {
  NotFoundError,
  BadRequestError,
} = require("../middleware/error-handler");
const { User, Admin, Teacher, Session } = require("../model");
const { Student } = require("../model/student");
const bcrypt = require("bcrypt");
const readXlsxFile = require("read-excel-file/node");
const { generateRandomString } = require("../helper/utils");
const V1Api = require("../helper/classcube-core-api-v1");

const allowedFileTypes = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/msexcel",
];

async function getAllUsers(req) {
  return User.find();
}

async function addAdmin(req, res, next) {
  const data = req.body;

  const photo = req.file ? req.file.path : null;

  const password = generateRandomString(8);

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password, salt);

  const totalAdmin = await Admin.countDocuments();
  if (totalAdmin > 10) {
    throw new BadRequestError("Maximum number of admins reached");
  }

  const admin = await new Admin({
    ...data,
    password: hashPassword,
    photo,
  }).save();

  const emailPayload = {
    to: [data.email],
    subject: "Welcome to Classcube",
    body: `Thank you for signing up with Classcube. <br> Your password is ${password}. Please change your password after logging in.`,
    schoolId: 11,
  };

  // TODO: add flag to check if notification should be sent
  new V1Api()
    .sendEmail(req.code, emailPayload)
    .then(() => logger.info("Email sent successfully"))
    .catch((error) => logger.error(error.message));

  return admin;
}

async function updateAdmin(req) {
  const body = { ...req.body };

  if (body.password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    body.password = bcrypt.hashSync(body.password, salt);
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.params.id,
    { $set: body },
    { new: true }
  ).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!updatedAdmin) {
    throw new NotFoundError("Admin not found");
  }

  return updatedAdmin;
}

async function getAdminById(req) {
  const admin = Admin.findById(req.params.id).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!admin) {
    throw new NotFoundError("Admin not found");
  }

  return admin;
}

async function addTeacher(req) {
  const data = req.body;

  const photo = req.file ? req.file.path : null;

  const password = generateRandomString(8);

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password, salt);

  const teacherExists = await Teacher.findOne({
    email: data.email,
    _userType: "teacher",
  });
  if (teacherExists) {
    throw new BadRequestError("Teacher already exists");
  }

  const teacher = await new Teacher({
    ...data,
    password: hashPassword,
    photo,
  }).save();

  const emailPayload = {
    to: [data.email],
    subject: "Welcome to Classcube",
    body: `Thank you for signing up with Classcube. <br> Your password is ${password}. Please change your password after logging in.`,
    schoolId: 11,
  };

  // TODO: add flag to check if notification should be sent
  new V1Api()
    .sendEmail(req.code, emailPayload)
    .then(() => logger.info("Email sent successfully"))
    .catch((error) => logger.error(error.message));

  return teacher;
}

async function addTeacherBulk(req) {
  const file = req.file;

  if (!allowedFileTypes.includes(file.mimetype)) {
    throw new BadRequestError(
      "Invalid file type. Only excel files are allowed"
    );
  }

  const teachersNotAdded = [];

  try {
    const rows = await readXlsxFile(file.path);

    // skip header
    rows.shift();

    for (const row of rows) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const password = generateRandomString(8);
      const hashPassword = bcrypt.hashSync(password, salt);

      const email = row[5];

      const teacherExists = await Teacher.findOne({
        email,
        _userType: "teacher",
      });

      if (!teacherExists) {
        await new Teacher({
          title: row[0],
          firstname: row[1],
          lastname: row[2],
          othernames: row[3],
          admissionNo: row[4],
          email,
          gender: row[6],
          password: hashPassword,
          phoneNumber: row[7],
        }).then((teacher) => {
          teacher.save();

          const emailPayload = {
            to: [data.email],
            subject: "Welcome to Classcube",
            body: `Thank you for signing up with Classcube. <br> Your password is ${password}. Please change your password after logging in.`,
            schoolId: 11,
          };

          // TODO: add flag to check if notification should be sent
          new V1Api()
            .sendEmail(req.code, emailPayload)
            .then(() => logger.info("Email sent successfully"))
            .catch((error) => logger.error(error.message));
        });
      } else {
        teachersNotAdded.push({
          firstname: row[1],
          lastname: row[2],
          email: row[5],
          reason: "Teacher already exists",
        });
      }
    }
  } catch (error) {
    logger.error(error.message);
    throw new BadRequestError("Error adding teachers");
  }

  return { teachersNotAdded };
}

async function getAllTeachers(req) {
  const { page = 1, limit = 15, search } = req.query;

  const searchQuery = {};

  if (search) {
    searchQuery.$or = [
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { othernames: { $regex: search, $options: "i" } },
    ];
  }

  return Teacher.paginate(searchQuery, {
    page,
    limit,
    select: {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    },
  });
}

async function getTeacherById(req) {
  const teacher = Teacher.findById(req.params.id)
    .populate([
      {
        path: "allocations",
        populate: [
          {
            path: "class",
            select: {
              name: 1,
            },
          },
          {
            path: "subject",
            select: {
              title: 1,
            },
          },
        ],
      },
    ])
    .select({
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    });
  if (!teacher) {
    throw new NotFoundError("Teacher not found");
  }

  return teacher;
}

async function updateTeacher(req) {
  const body = { ...req.body };

  if (body.password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    body.password = bcrypt.hashSync(body.password, salt);
  }

  return Teacher.findByIdAndUpdate(
    req.params.id,
    { $set: body },
    { new: true }
  ).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  });
}

async function addStudent(req) {
  const data = req.body;

  const photo = req.file ? req.file.path : null;

  const password = generateRandomString(8);

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password, salt);

  const studentExists = await Student.findOne({
    email: data.email,
    _userType: "student",
  });
  if (studentExists) {
    throw new BadRequestError("Student already exists");
  }

  const student = await new Student({
    ...data,
    password: hashPassword,
    photo,
  }).save();

  const emailPayload = {
    to: [data.email],
    subject: "Welcome to Classcube",
    body: `Thank you for signing up with Classcube. <br> Your password is ${password}. Please change your password after logging in.`,
    schoolId: 11,
  };

  // TODO: add flag to check if notification should be sent
  new V1Api()
    .sendEmail(req.code, emailPayload)
    .then(() => logger.info("Email sent successfully"))
    .catch((error) => logger.error(error.message));

  return student;
}

async function addStudentBulk(req) {
  const file = req.file;

  if (!allowedFileTypes.includes(file.mimetype)) {
    throw new BadRequestError(
      "Invalid file type. Only excel files are allowed"
    );
  }

  const studentsNotAdded = [];

  try {
    const rows = await readXlsxFile(file.path);

    // Skip header
    rows.shift();

    for (const row of rows) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const password = generateRandomString(8);
      const hashPassword = bcrypt.hashSync(password, salt);

      const email = row[5];

      const studentExists = await Student.findOne({
        email,
        _userType: "student",
      });

      if (!studentExists) {
        new Student({
          title: row[0],
          firstname: row[1],
          lastname: row[2],
          othernames: row[3],
          admissionNo: row[4],
          email,
          gender: row[6],
          password: hashPassword,
          phoneNumber: row[7],
        }).then((student) => {
          student.save();

          const emailPayload = {
            to: [data.email],
            subject: "Welcome to Classcube",
            body: `Thank you for signing up with Classcube. <br> Your password is ${password}. Please change your password after logging in.`,
            schoolId: 11,
          };

          // TODO: add flag to check if notification should be sent
          new V1Api()
            .sendEmail(req.code, emailPayload)
            .then(() => logger.info("Email sent successfully"))
            .catch((error) => logger.error(error.message));
        });
      } else {
        studentsNotAdded.push({
          firstname: row[1],
          lastname: row[2],
          email: row[5],
          reason: "Student already exists",
        });
      }
    }
  } catch (error) {
    logger.error(error.message);
    throw new BadRequestError("Error adding students");
  }

  return { studentsNotAdded };
}

async function getAllStudents(req) {
  const { page = 1, limit = 15, search } = req.query;

  const searchQuery = {};

  if (search) {
    searchQuery.$or = [
      { firstname: { $regex: search, $options: "i" } },
      { lastname: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { othernames: { $regex: search, $options: "i" } },
    ];
  }

  return Student.paginate(searchQuery, {
    page,
    limit,
    select: {
      password: 0,
      createdAt: 0,
      updatedAt: 0,
    },
  });
}

async function getStudentById(req) {
  const id = req.params.id;

  const student = Student.findById(id).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!student) {
    throw new NotFoundError("Student not found");
  }

  return student;
}

async function updateStudent(req) {
  const body = { ...req.body };

  if (body.password) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    body.password = bcrypt.hashSync(body.password, salt);
  }

  return Student.findByIdAndUpdate(
    req.params.id,
    { $set: body },
    { new: true }
  ).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  });
}

async function updateAdminPrivilege(req) {
  const admin = Admin.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  ).select({
    password: 0,
    createdAt: 0,
    updatedAt: 0,
  });
  if (!admin) {
    throw new NotFoundError("Admin not found");
  }

  return admin;
}

module.exports = {
  getAllUsers,
  addAdmin,
  updateAdmin,
  addTeacher,
  addTeacherBulk,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  addStudent,
  addStudentBulk,
  getAllStudents,
  getStudentById,
  updateStudent,
  getAdminById,
  updateAdminPrivilege,
};
