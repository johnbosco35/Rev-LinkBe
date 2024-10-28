const { Session, Term } = require("../model");
const {
  NotFoundError,
  BadRequestError,
} = require("../middleware/error-handler");

async function getAllTerms() {
  return Term.find().populate("session");
}

async function addTerm(req) {
  const { term, startDate, endDate, session } = req.body;

  const sessionExists = await Session.findById(session);
  if (!sessionExists) {
    throw new NotFoundError("Session not found.");
  }

  if (startDate > endDate) {
    throw new BadRequestError("Start date cannot be greater than end date.");
  }

  if (
    new Date(startDate) < sessionExists.startDate ||
    new Date(endDate) > sessionExists.endDate
  ) {
    throw new BadRequestError("Term dates must be within the session dates.");
  }

  const newTerm = new Term({
    term,
    startDate,
    endDate,
    session,
  });

  return newTerm.save();
}

async function updateTerm(req) {
  const { startDate, endDate, session } = req.body;

  if (session) {
    const sessionExists = await Session.findById(session);
    if (!sessionExists) {
      throw new NotFoundError("Session not found.");
    }

    if (
      startDate < sessionExists.startDate ||
      endDate > sessionExists.endDate
    ) {
      throw new BadRequestError("Term dates must be within the session dates.");
    }
  }

  const updatedTerm = await Term.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!updatedTerm) {
    throw new NotFoundError("No term found.");
  }

  return updatedTerm;
}

async function getTerm(req) {
  const term = await Term.findById(req.params.id).populate("session");
  if (!term) {
    throw new NotFoundError("No term found");
  }

  return term;
}

module.exports = {
  getAllTerms,
  addTerm,
  updateTerm,
  getTerm,
};
