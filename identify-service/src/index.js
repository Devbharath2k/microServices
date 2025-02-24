import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import helmet from 'helmet';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisClient from 'ioredis';
import logger from './Utils/logger.js';
import HandlerDatabase from './Config/db.js';
import router from './Router/identify-route.js';

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use((req, res, next) => {
    logger.info(`Received is from ${req.url} and points ${req.method}`);
    logger.info(`Request body: ${JSON.stringify(req.body)}`);
    next();
});

const client = new RedisClient(process.env.REDIS_URL);
client.on('error', (err) => {
    logger.error('Redis connection error:', err);
});

const redisLimiter = new RateLimiterRedis({
    storeClient: client,
    keyPrefix: 'rate-limiter',
    points: 100,
    duration: 60,
});

app.use((req, res, next) => {
    redisLimiter.consume(req.ip)
        .then(() => next())
        .catch(() => res.status(429).json({ message: "Too many requests, please try again later." }));
});

const sensitiveEndpoints = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.info(`Request from ${req.ip} blocked due to too many requests.`);
        res.status(429).json({ message: 'Too many requests, please try again later.' });
    },
    store: new RedisStore({
        sendCommand: (...args) => client.call(...args),
    })
});

app.use('/api/auth/register', sensitiveEndpoints);
app.use('/api/auth/login', sensitiveEndpoints); 
app.use('/api/auth/update', sensitiveEndpoints);
app.use('/api/auth/logout', sensitiveEndpoints);

app.use('/api/auth', router);

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    HandlerDatabase();
});