const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

const users = require("./routes/users");
const auth = require("./routes/auth");
const admin = require("./routes/admin");
const subject = require("./routes/subject");
const classLevel = require("./routes/class-level");
const classRoute = require("./routes/class");
const session = require("./routes/session");
const term = require("./routes/term");
const assignment = require("./routes/assignment");
const announcement = require("./routes/announcement");
const lesson = require("./routes/lesson");
const teacher = require("./routes/teacher");
const student = require("./routes/student");
const notification = require("./routes/notification");
const sync = require("./routes/sync");

const { errorHandler } = require("./middleware/error-handler");

const app = express();

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/admin", admin);
app.use("/api/v1/subjects", subject);
app.use("/api/v1/class-levels", classLevel);
app.use("/api/v1/classes", classRoute);
app.use("/api/v1/sessions", session);
app.use("/api/v1/terms", term);
app.use("/api/v1/assignments", assignment);
app.use("/api/v1/announcements", announcement);
app.use("/api/v1/lessons", lesson);
app.use("/api/v1/teacher", teacher);
app.use("/api/v1/student", student);
app.use("/api/v1/notifications", notification);
app.use("/api/v1/sync", sync);

app.get("/", (req, res) => {
  res.send("Classcube API is up and running!");
});

app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.originalUrl} not found`,
  });
});

app.use(errorHandler);

module.exports = app;
