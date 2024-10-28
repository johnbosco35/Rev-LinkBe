const {
  Session,
  Term,
  ClassLevel,
  Subject,
  Teacher,
  Admin,
  Class,
  SubjectAllocation,
  Student,
} = require("../model");
const logger = require("./logger");
const bcrypt = require("bcrypt");

class Sync {
  constructor(schoolCode, classcubeCoreApi) {
    this.schoolCode = schoolCode;
    this.classcubeCoreApi = classcubeCoreApi;
  }

  async sync() {
    const currentSession = await this.classcubeCoreApi.getCurrentSession();
    const sessions = await this.classcubeCoreApi.getSessions(this.schoolCode);

    for (const [key, value] of Object.entries(sessions)) {
      if (parseInt(key) > parseInt(currentSession)) continue;

      Session.updateOne(
        {
          coreApiId: key,
        },
        {
          name: value.session,
          startDate: value.startDate,
          endDate: value.endDate,
          coreApiId: key,
        },
        {
          upsert: true,
        }
      )
        .then(() => logger.info("Synced session created"))
        .catch((error) =>
          logger.error(`Error syncing sessions: ${error.message}`)
        );
    }

    const terms = await this.classcubeCoreApi.getTerms(this.schoolCode);
    const currentTerm = await this.classcubeCoreApi.getCurrentTerm(
      this.schoolCode
    );

    for (const [key, value] of Object.entries(terms)) {
      if (parseInt(key) > parseInt(currentTerm)) continue;

      const session = await Session.findOne({
        coreApiId: value.sessionID,
      });

      if (!session) {
        logger.error(`Session with core api id "${value.sessionID}" not found`);
        continue;
      }

      Term.updateOne(
        {
          coreApiId: key,
        },
        {
          term: value.term,
          startDate: value.startDate,
          endDate: value.endDate,
          session: session._id,
          coreApiId: key,
        },
        {
          upsert: true,
        }
      )
        .then(() => logger.info("Synced term created"))
        .catch((error) =>
          logger.error(`Error syncing terms: ${error.message}`)
        );
    }

    const levels = await this.classcubeCoreApi.getLevels(this.schoolCode);

    for (const level of levels) {
      const idLevel = level.split(";");

      ClassLevel.updateOne(
        {
          coreApiId: idLevel[0],
        },
        {
          name: idLevel[1],
          coreApiId: idLevel[0],
        },
        {
          upsert: true,
        }
      )
        .then(() => logger.info("Synced class level created"))
        .catch((error) =>
          logger.error(`Error syncing class levels: ${error.message}`)
        );
    }

    const classes = await this.classcubeCoreApi.getClasses(this.schoolCode);

    for (const [key, value] of Object.entries(classes)) {
      const classLevel = await ClassLevel.findOne({
        coreApiId: value.level_id,
      });
      if (!classLevel) {
        logger.error(
          `Class Level with core api id "${value.level_id} not found`
        );
      }

      Class.updateOne(
        {
          coreApiId: key,
        },
        {
          name: value.class,
          level: classLevel,
          coreApiId: key,
        },
        { upsert: true }
      )
        .then(() => logger.info("Synced class created"))
        .catch((error) =>
          logger.error(`Error syncing classes: ${error.message}`)
        );
    }

    const subjects = await this.classcubeCoreApi.getSubjects(this.schoolCode);

    for (const [key, value] of Object.entries(subjects)) {
      Subject.updateOne(
        {
          coreApiId: key,
        },
        {
          title: value.title,
          status: value.status,
          abbreviation: value.abbreviation,
          type: value.type,
          coreApiId: key,
        },
        { upsert: true }
      )
        .then(() => logger.info("Synced subject created"))
        .catch((error) =>
          logger.error(`Error syncing subjects: ${error.message}`)
        );
    }

    const teachers = await this.classcubeCoreApi.getTeachers(this.schoolCode);

    for (const [key, value] of Object.entries(teachers)) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(value.password, salt);

      Teacher.updateOne(
        {
          coreApiId: key,
        },
        {
          title: value.title,
          firstname: value.firstname,
          lastname: value.surname,
          othernames: value.middlename,
          email: value.email,
          phoneNumber: value.mobile,
          password: hashPassword,
          gender: value.gender,
          coreApiId: key,
        },
        { upsert: true }
      )
        .then(() => logger.info("Synced teacher created"))
        .catch((error) =>
          logger.error(`Error syncing teachers: ${error.message}`)
        );
    }

    const admins = await this.classcubeCoreApi.getAdmins(this.schoolCode);

    for (const [key, value] of Object.entries(admins)) {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(value.password, salt);

      Admin.updateOne(
        {
          coreApiId: key,
        },
        {
          firstname: value.name,
          email: value.email,
          phoneNumber: value.mobile,
          password: hashPassword,
          coreApiId: key,
        },
        { upsert: true }
      )
        .then(() => logger.info("Synced admin created"))
        .catch((error) =>
          logger.error(`Error syncing admins: ${error.message}`)
        );
    }

    const sessionId = await this.classcubeCoreApi.getCurrentSession(
      this.schoolCode
    );

    for (const classId of Object.keys(classes)) {
      const classStudents = await this.classcubeCoreApi.getSessionClassStudents(
        sessionId,
        classId,
        this.schoolCode
      );

      if (!classStudents) continue;

      const enrollmentDate = new Date();

      for (const [key, value] of Object.entries(classStudents)) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(
          value.password || "Password12345",
          salt
        );

        Student.updateOne(
          {
            coreApiId: key,
          },
          {
            firstname: value.firstname,
            lastname: value.surname,
            othernames: value.middlename,
            email: value.email,
            phoneNumber: value.mobile,
            gender: value.sex,
            coreApiId: key,
            password: hashPassword,
            enrollmentDate,
          },
          { upsert: true }
        )
          .then(() => logger.info("Synced student created"))
          .catch((error) =>
            logger.error(`Error syncing students: ${error.message}`)
          );
      }
    }

    const allocations = await this.classcubeCoreApi.getAllocations(
      this.schoolCode
    );

    if (!allocations) return;

    for (const [key, value] of Object.entries(allocations)) {
      const [teacher, subject, studentClass] = await Promise.all([
        Teacher.findOne({
          coreApiId: value.teacher_id,
        }),
        Subject.findOne({
          coreApiId: value.subject_id,
        }),
        Class.findOne({
          coreApiId: value.class_id,
        }),
      ]);

      if (!teacher) {
        logger.error(
          `Teacher with core api id "${value.teacher_id}" not found`
        );
        continue;
      }

      if (!subject) {
        logger.error(
          `Subject with core api id "${value.subject_id}" not found`
        );
      }

      if (!studentClass) {
        logger.error(`Class with core api id "${value.class_id}" not found`);
        continue;
      }

      SubjectAllocation.updateOne(
        {
          coreApiId: key,
        },
        {
          teacher: teacher._id,
          subject: subject._id,
          class: studentClass._id,
          coreApiId: key,
        },
        { upsert: true }
      )
        .then(() => logger.info("Synced allocation created"))
        .catch((error) =>
          logger.error(`Error syncing allocations: ${error.message}`)
        );
    }
  }
}

module.exports = Sync;
