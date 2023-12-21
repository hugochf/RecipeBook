const winston = require("winston");
// require("winston-mongodb");
const { combine, timestamp, printf, colorize, align } = winston.format;
require("express-async-errors");

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [new winston.transports.Console()],
  exceptionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "exception.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "rejections.log" }),
  ],
});

winston.add(new winston.transports.File({ filename: "logfile.log" }));
// winston.add(
//   new winston.transports.MongoDB({
//     db: "mongodb://localhost:27017/recipebook",
//     options: {
//       useUnifiedTopology: true,
//     },
//     level: "error",
//   })
// );

module.exports = logger;
