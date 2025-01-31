import multer, {diskStorage} from "multer"
import {extname as _extname } from "path";

const storage= diskStorage({
    destination: function (_req,_file,cb){
        cb(null,'.public/temp')
    },
    filename: function (_req,file,cb){
        cb(null,file.originalname)
    }
});

export const upload = multer({
    storage:storage,

    fileFilter:function (_req,file,cb){
        const filetypes= /jpeg|jpg|png|gif/;
        const extname = filetypes.test(_extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if(extname && mimetype){
            cb(null, true);
        } else {
            cb(new Error("File type not supported"), false);
        }


    }
})

