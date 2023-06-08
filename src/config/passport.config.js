import passport from "passport";
import LocalStrategy from "passport-local";
import userModel from "../dao/models/users.model.js";

const authRegist= async (userName,password, done)=>{
    try{

        const user= await userModel.findOne({userName:userName})

        if (user === null) {
            return done(null, { _id: 0 });
        } else {
            return done(null, false, { message: 'El email ya se encuentra registrado' });
        }
        
    }catch(err){
        return done(err.message)
    }
}
 

passport.use("authRegister", new LocalStrategy({ usernameField: "userName", passwordField: "password"}, authRegist))

passport.serializeUser((user, done)=>{
    done(null, user._id)
})

passport.deserializeUser(async (id,done)=>{
    try{

        const user= await userModel.findById(id)
        done(null, user) 

    }catch(err){
        done(err.message)
    }
})

export default passport

