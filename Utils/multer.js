import multer from 'multer';

const storage = multer.memoryStorage();

const profilephotoUpload = multer({storage}).single('profilephoto');

const resumeUpload = multer({storage}).single('resume');

const logoUpload = multer({storage}).single('logo');

export {profilephotoUpload, resumeUpload, logoUpload}