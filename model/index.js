const { User } = require("./user");
const { Admin } = require("./admin");
const { Teacher } = require("./teacher");
const { Student } = require("./student");
const { Class } = require("./class");
const Note = require("./note");
const { LessonNote } = require("./lesson-note");
const { Subject } = require("./subject");
const { ClassLevel } = require("./class-level");
const { Session } = require("./session");
const { Term } = require("./term");
const { Assignment } = require("./assignment");
const { Announcement } = require("./announcement");
const AssignmentGroup = require("./assignment-group");
const { SubjectAllocation } = require("./subject-allocation");
const { ClassHistory } = require("./class-history");
const { AssignmentSubmission } = require("./assignment-submission");
const { Notification } = require("./notification");

module.exports = {
  User,
  Admin,
  Teacher,
  Student,
  Class,
  LessonNote,
  Note,
  Subject,
  ClassLevel,
  Session,
  Term,
  Assignment,
  Announcement,
  AssignmentGroup,
  SubjectAllocation,
  ClassHistory,
  AssignmentSubmission,
  Notification,
};
