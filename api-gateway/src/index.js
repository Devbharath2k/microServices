import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import logger from "./Utils/logger.js";
import Redis from "ioredis";
import proxy from "express-http-proxy";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redisClient = new Redis(process.env.REDIS_URL);

const ratelimitOptions = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json({ success: false, message: "Too many requests" });
    },
    store: new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
    }),
});
app.use(ratelimitOptions);

app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
});

const proxyOptions = {
    proxyReqPathResolver: (req) => req.originalUrl,
    proxyErrorHandler: (err, res, next) => {
        logger.error(`Proxy error: ${err.message}`);
        if (err.code === 'ECONNREFUSED') {
            return res.status(502).json({ message: "Service unavailable. Please try again later." });
        }
        next(err);
    }
};

app.use("/api/auth", proxy(process.env.IDENTITY_SERVICE_URL,  proxyOptions));

app.listen(port, () => {
    logger.info(`API Gateway is running on port ${port}`);
    logger.info(`Identity service proxied to ${process.env.IDENTITY_SERVICE_URL}`);
});