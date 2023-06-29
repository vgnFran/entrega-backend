import passport from 'passport';
import jwt from 'passport-jwt';

const JWTStrategy = jwt.Strategy;
const JWTExtractor = jwt.ExtractJwt;


const tokenExtractor = (req) => {
    const authHeader = req.headers.authorization;



 const token = authHeader && authHeader.split(' ')[1];



 return token; 


}

const jwtData = {
    jwtFromRequest: JWTExtractor.fromExtractors([tokenExtractor]),
    secretOrKey: 'abc123' 
}


const verify = async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch(err) {
        return done(err.message);
    }
};

const initPassportJwt = () => {
    passport.use('tokenAuth', new JWTStrategy(jwtData, verify));
}


export {initPassportJwt}