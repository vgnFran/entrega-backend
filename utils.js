import * as url from 'url';
import bcrypt from "bcrypt";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const hashing= (pass)=>{
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
}

const compareHash= (user,pass)=>{
    return bcrypt.compareSync(pass,user.password)
}


const validate =async (req,res,next)=>{
    // if(req.sessionStore.userValidated){
    //     next()
    // }else{
    //     res.status(401).send("Debe autenticarse para ingresar")
    // }
    

}

export { __filename, __dirname, hashing, compareHash, validate }; 