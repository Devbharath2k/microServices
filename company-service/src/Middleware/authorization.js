import dotenv from 'dotenv';
import logger from '../Utils/logger.js';
dotenv.config();


const AuthenticatRequest = async (req, res,) => {
   try {
      const userId = req.headers['x-user-id'];
      if(!userId){
        logger.warn(`No user id provided in the request headers`)
        return res.status(401).json({ message: 'No user id provided' });
      }
      req.user = {userId};
   } catch (err) {
      logger.error(`Authentication failed for ${req.url}`)
      return res.status(401).json({ message: 'Authentication failed' });
   }
}

export default AuthenticatRequest;