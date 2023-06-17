import jwt from "jsonwebtoken";

const key= "abc123"

const newToken=(user,time)=>{
    return jwt.sign(user,key,{expiresIn: time})
}

const validateToken=(req,res,next)=>{
    const authHeader= req.headers.autorization

    console.log(authHeader)
}

export default newToken