import multer from 'multer';

const storage = multer.memoryStorage();

const LogoUpload = multer({storage}).single('logo');

export default {LogoUpload};