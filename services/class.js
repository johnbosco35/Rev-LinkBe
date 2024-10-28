const { Class, ClassLevel } = require("../model");
const { NotFoundError } = require("../middleware/error-handler");

async function getAllClasses(req) {
  const { paginate = "true" } = req.query;

  if (paginate === "false") {
    return Class.find().populate("level");
  }

  return Class.paginate({}, { populate: "level" });
}

async function addClass(req) {
  const { level, name } = req.body;

  const classExists = await ClassLevel.findById(level);
  if (!classExists) {
    throw new NotFoundError("Class level not found");
  }

  const newClass = new Class({ name, level });

  return newClass.save();
}

async function getClass(req) {
  const { id } = req.params;

  const classExists = await Class.findById(id).populate("level");
  if (!classExists) {
    throw new NotFoundError("Class not found");
  }

  return classExists;
}

async function updateClass(req) {
  const { id } = req.params;

  const updatedClass = await Class.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedClass) {
    throw new NotFoundError("Class not found");
  }

  return updatedClass;
}

module.exports = {
  getAllClasses,
  addClass,
  getClass,
  updateClass,
};
