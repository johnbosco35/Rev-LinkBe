function successResponse(res, message, data = null) {
  return res.status(200).json({ status: "success", message, data });
}

function createdResponse(res, message, data = null) {
  return res.status(201).json({ status: "success", message, data });
}

module.exports = {
  successResponse,
  createdResponse,
};
