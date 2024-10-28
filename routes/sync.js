const express = require("express");
const router = express.Router();
const dbc = require("../config/database");
const syncService = require("../services/sync");
const jwt = require("../middleware/jwt");
const { successResponse } = require("../helper/response");

dbc();

router.use(jwt);

router.route("/").post(sync);

function sync(req, res, next) {
  syncService
    .sync(req)
    .then((result) => successResponse(res, "Sync successful"))
    .catch((err) => next(err.message));
}

module.exports = router;
