import passport from "passport";
import GithubStrategy from "passport-github2"
import userModel from "../models/dao/models/users.model.js"

const initializePassport= ()=>{

    const githubData={
        clientID:"Iv1.d7ad4fe6eb1b4f98",
        clientSecret:"4c0b7629d7e9624c37384f0fa39805331771c259",
        callbackUrl:"http://localhost:8080/githubcallback"
    }


    const authGitHub= async(accesToken, refreshToken, profile, done)=>{
        try {
            const user = await userModel.findOne({ userName: profile._json.email });

            if(!user){
                const newUser={
                    userName: profile._json.email,
                    password:"",
                    name: profile._json.login,
                    rol:"user"
                }
                const result= await userModel.create(newUser)
                done(null,result)
            } else {
                done(null, user);
            }
        } catch (err) {
            
            return done(err.message);
        }
    }

    passport.use("github", new GithubStrategy(githubData, authGitHub))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err.message);
        }
    });




}

export default initializePassport
