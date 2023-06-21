import jwt from "jsonwebtoken";

const key= "abc123"

const newToken=(user,time)=>{
    return jwt.sign(user,key,{expiresIn: time})
    
}

const authToken = (req, res, next) => {

    const authHeader = req.headers.authorization; 

    if (!authHeader) return res.status(403).send({ err: 'Se requiere autenticación' });

    const token = authHeader.split(' ')[1];
    jwt.verify(token, key, (err, credentials) => {
        if (err) return res.status(403).send({ err: 'Se requiere autenticación' });

        req.user = credentials.user;
        next();
    });
}
// const authToken = (req, res, next) => {

//     // const authHeader = req.headers.authorization; 

//     // if (!authHeader) return res.status(403).send({ err: 'Se requiere autenticación' });

//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRnJhbmNvIiwiZW1haWwiOiJmcmRhc2Rhc2RzbmFvczIxMTJAZ21haWwuY29tIiwic3VyTmFtZSI6IkhveW9zIiwicm9sIjoidXN1YXJpbyIsImFnZSI6IjIzIiwiaWF0IjoxNjg3MzExMzA4LCJleHAiOjE2ODczOTc3MDh9.NsWdHuAeL7HQ4kZqv3RFWoGPnKZpQay68dOKhCAwuwU"
//     jwt.verify(token, key, (err, credentials) => {
//         if (err) return res.status(403).send({ err: 'Se requiere autenticación' });

//         req.user = credentials.user;
//         next();
//     });
// }



export {newToken, authToken}