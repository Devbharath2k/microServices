import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import logger from '../Utils/logger.js';
import user from '../Model/userModel.js';
dotenv.config();

const AccessToken = async (userId) => {
    try {
        const token = jwt.sign({id : userId},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        return token;
    } catch (error) {
        logger.error(error);
        return null;
    }
}

const Refreshtoken = async (userId) => {
    try {
        const token = jwt.sign({id : userId},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        )
        const updatetoken = await user.updateOne({id: user._id},{
            refresh_token : token,
        })
        return token;
    } catch (error) {
        logger.error(error);
        return null;
    }
}

const isAuthorization = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        console.log("token: " + token);
        if(!token){
            logger.warn(`token is error`)
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decoded){
            logger.warn(`token is error`)
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.id = decoded.id;
        next();
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export {AccessToken, Refreshtoken, isAuthorization}