import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    destination: function (req,file,cb){
        const destination = path.join('src/uploads', req.body.documents); 
        cb(null, destination);
    },
    filename: function (req, file, cb) {
        const extension = path.extname(file.originalname); 
        const name= req.body.documents+"-"+req.session.user.userName + extension
        cb(null, name); 
    }
});
const upload = multer({ storage: storage });

export default upload