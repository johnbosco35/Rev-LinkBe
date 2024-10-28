const { Subject } = require("../model");
const { NotFoundError } = require("../middleware/error-handler");

async function getSubjects(req) {
  const conditions = {};
  const { paginate = "true" } = req.query;

  if (req.query.title) {
    conditions.title = { $regex: req.query.title, $options: "i" };
  }

  if (paginate === "false") {
    return Subject.find(conditions);
  }

  return Subject.paginate(conditions, {
    page: req.query.page,
    limit: req.query.limit,
  });
}

async function addSubject(req) {
  const { title, abbreviation, type } = req.body;
  const thumbnail = req.file ? req.file.path : null;

  const subject = new Subject({
    title,
    abbreviation,
    type,
    thumbnail,
  });

  return subject.save();
}

async function updateSubject(req) {
  const subject = await Subject.findById(req.params.id);
  if (!subject) {
    throw new NotFoundError("No subject found");
  }

  const thumbnail = req.file ? req.file.path : subject.thumbnail;

  return Subject.findByIdAndUpdate(
    req.params.id,
    { ...req.body, thumbnail },
    { new: true }
  );
}

module.exports = {
  getSubjects,
  addSubject,
  updateSubject,
};
