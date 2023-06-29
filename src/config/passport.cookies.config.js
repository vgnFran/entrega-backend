import passport from 'passport';
import jwt from 'passport-jwt';

const JWTStrategy = jwt.Strategy;
const JWTExtractor = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    if (req && req.cookies) { // hay cookies
        return req.cookies['cookie'];
    }

    return null;
}

const jwtData = {
    jwtFromRequest: JWTExtractor.fromExtractors([cookieExtractor]),
    secretOrKey: 'abc123' // misma que en app.js
}

const verify = async (jwt_payload, done) => {
    try {
        return done(null, jwt_payload);
    } catch(err) {
        return done(err.message);
    }
};

const initPassport = () => {
    passport.use('jwtAuth', new JWTStrategy(jwtData, verify));
}


export {initPassport}