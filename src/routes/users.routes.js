import { Router } from "express";
import { __dirname } from "../../utils.js";
import passport from "../auth/passport.config.js"
import initializePassport from "../auth/passportGithub.config.js";
import { newToken, authToken} from "../auth/jwt.config.js";
import { checkUser, login, logout, passportValidateCookies, passportValidateToken, regFail, register, registerRender, validateToken } from "../controllers/usersController.js";

initializePassport()


const usersRoutes=()=>{
    const router=Router()


    router.get("/", checkUser)

    router.get("/logout",logout)

    router.post("/login", login)

    router.get("/register", registerRender)

    router.post("/register", passport.authenticate("authRegister",{failureRedirect: "/regfail"}), register )





    //endpoints para validar usuario con jwt y headers

    router.get("/private",authToken,validateToken)

    router.get("/current1", passport.authenticate('tokenAuth', { session: false }), passportValidateToken)



    //endpoint para validar usuario por cookies (habilitar cookieparser)
    router.get("/current",passport.authenticate('jwtAuth', { session: false }), passportValidateCookies )



    router.get("/regfail", regFail)


    //endpoints login github 
    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    });

    router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });
   
    


    return router

}

export default usersRoutes




