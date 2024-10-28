const mongoose = require("mongoose");
const logger = require("../helper/logger");

module.exports = () => {
  const dbc = mongoose.connection;

  if (dbc.readyState == 0) {
    mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useFindAndModify: false
    });

    dbc.on("error", (err) => {
      throw err;
    });
    dbc.once("open", () => {
      logger.info("Connected to DB");
    });

    process.on("SIGINT", () => {
      dbc.close(() => {
        logger.info("DB connection terminated");
        process.exit(0);
      });
    });
  }
};
