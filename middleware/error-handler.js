const { MulterError } = require("multer");
const { JsonWebTokenError } = require("jsonwebtoken");
const ev = require("express-validation");
const logger = require("../helper/logger");

function errorHandler(err, req, res, next) {
  if (typeof err === "string") {
    return res.status(400).json({ status: "error", message: err });
  }

  if (err.name === "AccountError") {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ status: "error", message: "Invalid Token" });
  }

  if (err.name === "ForbiddenError") {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to perform this action",
    });
  }

  if (err.name === "NotFoundError") {
    return res.status(404).json({ status: "error", message: err.message });
  }

  if (err.name === "BadRequestError") {
    return res.status(400).json({ status: "error", message: err.message });
  }

  if (err instanceof MulterError) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof JsonWebTokenError) {
    return res.status(401).json({ status: "error", message: err.message });
  }

  if (err instanceof ev.ValidationError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.details.body[0].message,
    });
  }

  logger.error(err.message);

  if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while processing your request",
    });
  } else {
    return res.status(500).json({ status: "error", message: err.message });
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);

    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

class AccountError extends Error {
  constructor(code, message) {
    super(message);

    this.name = "AccountError";
    this.code = code;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);

    this.name = "ForbiddenError";
    this.status = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.name = "NotFoundError";
    this.status = 404;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);

    this.name = "BadRequestError";
    this.status = 400;
  }
}

module.exports = {
  errorHandler,
  UnauthorizedError,
  AccountError,
  ForbiddenError,
  NotFoundError,
  BadRequestError,
};
