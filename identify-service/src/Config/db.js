import mongoose from 'mongoose';
import logger from '../Utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const Monogdb = process.env.Mongodb;

if(!Monogdb){
    throw new Error('Missing Mongodb connection string');
}

const HandlerDatabase = async (req, res, next)=> {
    try {
        await mongoose.connect(Monogdb);
        console.log(`Mongodb connection established :)`);
        
    } catch (error) {
        logger.error(error);
        res.status(500).send('Server Error').json({
            message: 'Failed to connect to the database'
        })
    }
}

export default HandlerDatabase;