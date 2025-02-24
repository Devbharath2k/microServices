import DataURIparser from 'datauri/parser.js';
import path from 'path';

const getdatauri = (file) =>{
    if(!file || !file.originalname || !file.buffer){
        throw new Error('Invalid file provided');
    }
    const parser = new DataURIparser();
    const ext = path.extname(file.originalname).toString();
    return parser.format(ext, file.buffer)
}

export default getdatauri;