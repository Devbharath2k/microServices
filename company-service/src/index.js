import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import HandlerDatabase from './Config/db.js';
import logger from './Utils/logger.js';
import cookieparser from 'cookie-parser';

const app = express();
const port = process.env.PORT;

app.use((cors({
    origin:"*",
    methods :['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders : ['Origin', 'X-Requested-With', 'Content-Type', 'Authorization'],
    credentials: true
})))
app.use(helmet());
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({extended : true}));


app.listen(port,()=>{
    logger.info(`Server is running on port ${port}`);
    HandlerDatabase(); 
})
