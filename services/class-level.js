const { ClassLevel } = require("../model");
const { NotFoundError } = require("../middleware/error-handler");

async function getClassLevel(req) {
  const classLevel = await ClassLevel.findById(req.params.id);
  if (!classLevel) {
    return next(new NotFoundError("Class level not found"));
  }

  return classLevel;
}

async function getAllClassLevels(req) {
  return ClassLevel.find();
}

async function createClassLevel(req) {
  const classLevel = new ClassLevel(req.body);
  return classLevel.save();
}

async function updateClassLevel(req) {
  const classLevel = await ClassLevel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  if (!classLevel) {
    throw new NotFoundError("Class level not found");
  }

  return classLevel;
}

module.exports = {
  getClassLevel,
  getAllClassLevels,
  createClassLevel,
  updateClassLevel,
};
