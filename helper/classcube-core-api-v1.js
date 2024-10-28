const CoreApiRequest = require("./request");

class CoreV1Methods {
  constructor() {
    this.request = new CoreApiRequest();
  }

  async getSchoolDetails(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "get_school_code_id",
      "meta[schoolCode]": schoolCode,
      "meta[details]": true,
    };

    return await this.request.performHttpRequest(payload);
  }

  async getCurrentTerm(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "cur_term_id",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getCurrentTermNumber(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "cur_term",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getCurrentSession(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "cur_session_id",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getSessions(schoolCode) {
    const payload = {
      call: "get_all_school_sessions",
      code: schoolCode,
    };

    return await this.request.performHttpRequest(payload);
  }

  async getTerms(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "get_term_session_ids",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getLevels(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "class_levels",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getClasses(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "school_classes",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getSubjects(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "get_school_subjects",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getTeachers(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "list_school_staff",
      "meta[type]": "academic",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getAdmins(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "list_school_admins",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getClassLevelStudents(schoolCode, classLevelId, sessionId) {
    const payload = {
      code: schoolCode,
      call: "get_session_class_level_students",
      "meta[sessionID]": sessionId,
      "meta[levelID]": classLevelId,
    };

    return await this.request.performHttpRequest(payload);
  }

  async getAllocations(schoolCode) {
    const payload = {
      code: schoolCode,
      call: "get_all_teacher_subjects",
    };

    return await this.request.performHttpRequest(payload);
  }

  async getGradePercentages(sessionId, schoolCode) {
    const payload = {
      code: schoolCode,
      call: "get_school_performance_settings",
      "meta[sessionID]": sessionId,
    };

    return await this.request.performHttpRequest(payload);
  }

  async getStudentClass(sessionId, classLevelId, schoolCode) {
    const payload = {
      code: schoolCode,
      call: "get_student_class",
      "meta[sessionID]": sessionId,
      "meta[classLevelID]": classLevelId,
    };

    return await this.request.performHttpRequest(payload);
  }

  async getSessionClassStudents(sessionId, classLevelId, schoolCode) {
    const payload = {
      code: schoolCode,
      call: "get_session_class_students",
      "meta[sessionID]": sessionId,
      "meta[classLevelID]": classLevelId,
    };

    return await this.request.performHttpRequest(payload);
  }

  async addTeacher(schoolCode, data) {
    const payload = {
      call: "register_staff",
      code: schoolCode,
      "meta[staffType]": "academic",
      "meta[title]": data.title,
      "meta[surname]": data.lastname,
      "meta[firstname]": data.firstname,
      "meta[middlename]": data.othernames,
      "meta[sex]": data.gender,
      "meta[level]": 1,
      "meta[department_id]": 0,
      "meta[mobile]": data.phoneNumber,
      "meta[email]": data.email,
      "meta[password]": data.password,
    };

    return await this.request.performHttpRequest(payload);
  }

  async updateTeacher(schoolCode, data) {
    const payload = {
      call: "update_staff",
      code: schoolCode,
      "meta[id]": data.coreApiId,
      "meta[staffType]": "academic",
      "meta[title]": data.title,
      "meta[surname]": data.lastname,
      "meta[firstname]": data.firstname,
      "meta[middlename]": data.othernames,
      "meta[sex]": data.gender,
      "meta[level]": 1,
      "meta[department_id]": 0,
      "meta[mobile]": data.phoneNumber,
      "meta[email]": data.email,
      "meta[password]": data.password,
    };

    return await this.request.performHttpRequest(payload);
  }

  async addStudent(schoolCode, data) {
    const payload = {
      call: "register_student",
      code: schoolCode,
      "meta[surname]": data.lastname,
      "meta[firstname]": data.firstname,
      "meta[othernames]": data.othernames,
      "meta[sex]": data.gender,
      "meta[classID]": data.classId, // TODO: need to figure what this is
      "meta[email]": data.email,
      "meta[mobile]": data.phoneNumber,
    };

    return await this.request.performHttpRequest(payload);
  }

  async updateStudent(schoolCode, data) {
    const payload = {
      call: "update_student",
      code: schoolCode,
      "meta[studentID]": data.coreApiId,
      "meta[surname]": data.lastname,
      "meta[firstname]": data.firstname,
      "meta[othernames]": data.othernames,
      "meta[sex]": data.gender,
      "meta[classID]": data.classId, // TODO: need to figure what this is
      "meta[email]": data.email,
      "meta[mobile]": data.phoneNumber,
    };

    return await this.request.performHttpRequest(payload);
  }

  async sendEmail(schoolCode, data) {
    const payload = {
      call: "send_mail",
      code: schoolCode,
      "meta[to]": data.to.join(","),
      "meta[emailfrom]": "support@examcentre.ng",
      "meta[subject]": data.subject,
      "meta[body]": data.body,
      "meta[type]": "classcube",
      "meta[schoolID]": data.schoolId,
    };

    return await this.request.performHttpRequest(payload);
  }
}

module.exports = CoreV1Methods;
