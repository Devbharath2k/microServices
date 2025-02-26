import dotenv from 'dotenv';
import winston from 'winston'
dotenv.config();


const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production'? 'info' : 'debug',
    format: winston.format.combine(
       winston.format.timestamp(),
          winston.format.colorize(),
          winston.format.errors({stack : true}),
          winston.format.splat(),
          winston.format.json(),
          winston.format.simple()
    ),
    defaultMeta: { service: 'company-service' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
})

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
        format : winston.format.timestamp(),
        colorize: true
    }))
}

export default logger;