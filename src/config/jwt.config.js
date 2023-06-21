import jwt from "jsonwebtoken";

const key= "abc123"

const newToken=(user,time)=>{
    return jwt.sign(user,key,{expiresIn: time})
    
}

const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization; 
    console.log(authHeader)
    if (!authHeader) return res.status(403).send({ err: 'Se requiere autenticación' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, key, (err, credentials) => {
        if (err) return res.status(403).send({ err: 'Se requiere autenticación' });

        req.user = credentials.user;
        next();
    });
}



export {newToken, authToken}