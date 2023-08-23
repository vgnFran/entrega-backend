import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import passport from "../auth/passport.config.js"
import initializePassport from "../auth/passportGithub.config.js";
import { newToken, authToken} from "../auth/jwt.config.js";
import { checkUser, login, logout, passportValidateCookies, passportValidateToken, regFail, register, registerRender, validateToken, isAdmin, loggerTest, changeRol, restore, rest, recovery, newPass, changeRolUid } from "../controllers/usersController.js";
import { newPurchase } from "../controllers/ticketController.js";


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



    
    // ingresar al endpoint /purchase (con un usuario ya logeado) y se realizara la compra 
    router.get("/purchase",newPurchase)

    router.get("/loggerTest", loggerTest)


    // endpoints para restablecer contraseñas

    router.get("/restore", restore)

    router.get("/rest", rest)

    router.get("/recovery", recovery)

    router.get("/newpass", newPass)



    // endpoint para cambiar el rol del user

    router.get("/users/premium", changeRol ) // cambia el rol del usuario que este haya iniciado sesion

    router.get("/users/premium/:uid", changeRolUid) // cambia el rol del usuario que se proporcione por :uid

    return router

}

export default usersRoutes




