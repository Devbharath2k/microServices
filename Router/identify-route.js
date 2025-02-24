import express from 'express';
import { isAuthorization } from '../Middleware/generateToken.js';
import { resumeUpload, logoUpload, profilephotoUpload } from '../Utils/multer.js';
import userController from '../Controller/userprofile.js';
const router = express.Router();

router.post('/register',  profilephotoUpload, userController.register);
router.post('/login', userController.login);
router.post('/update', resumeUpload, isAuthorization, userController.update);
router.post('/logout', userController.logout);

export default router;