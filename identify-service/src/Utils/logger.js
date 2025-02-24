import winston from "winston";
import dotenv from "dotenv";
dotenv.config();

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.errors({stack : true}),
    winston.format.splat(),
    winston.format.json(),
    winston.format.simple()
  ),
  defaultMeta: { service: 'identify-service' },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
      format: winston.format.colorize(),
      format: winston.format.timestamp(),
    })
  );
}

export default logger;
