import jwt from "jsonwebtoken";
import errorManager from "../services/errorManager.js";
import { dictionary } from "../utils/dictionary.js";
const key= "abc123"


const newToken=(user,time)=>{
    return jwt.sign(user,key,{expiresIn: time})
    
}

const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization; 
    
    if (!authHeader){
        throw new errorManager(dictionary.unauthorized)
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, key, (err, credentials) => {
        if (err) return res.status(403).send({ err: 'Se requiere autenticación' });       
        req.logger.info(credentials)
        req.user = credentials;
        next();
    });
}



export {newToken, authToken}
