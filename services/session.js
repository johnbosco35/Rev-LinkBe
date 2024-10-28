const { Session } = require("../model");

async function getAllSessions() {
  return Session.find();
}

async function addSession(req) {
  const session = new Session(req.body);

  return session.save();
}

async function getSession(req) {
  const { id } = req.params;

  return Session.findById(id);
}

async function updateSession(req) {
  const { id } = req.params;

  const session = await Session.findByIdAndUpdate(id, req.body, { new: true });
  if (!session) {
    throw new NotFoundError("No session found");
  }

  return session;
}

module.exports = {
  getAllSessions,
  addSession,
  getSession,
  updateSession,
};
