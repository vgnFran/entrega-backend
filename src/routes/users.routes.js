import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import passport from "../auth/passport.config.js"
import initializePassport from "../auth/passportGithub.config.js";
import { newToken, authToken} from "../auth/jwt.config.js";
import { checkUser, login, logout, passportValidateCookies, passportValidateToken, regFail, register, registerRender, validateToken, isAdmin, loggerTest, changeRol, restore, rest, recovery, newPass, changeRolUid, updateProfile, isUser  } from "../controllers/usersController.js";
import { newPurchase } from "../controllers/ticketController.js";
import upload from "../utils/uploader.js";
import errorManager from "../services/errorManager.js";
import { dictionary } from "../utils/dictionary.js";
import user from "../models/dao/models/users.model.js";


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
    router.get("/purchase",isUser ,newPurchase)

    router.get("/loggerTest", loggerTest)


    // endpoints para restablecer contraseñas

    router.get("/restore",isUser, restore)

    router.get("/rest",isUser, rest)

    router.get("/recovery",isUser, recovery)

    router.get("/newpass",isUser, newPass)



    // endpoint para cambiar el rol del user

    router.get("/users/premium", changeRol ) // cambia el rol del usuario que este haya iniciado sesion

    router.get("/users/premium/:uid", changeRolUid) // cambia el rol del usuario que se proporcione por :uid


    router.get("/updateProfile",isUser, updateProfile)    // render de plantilla para subir documentos o imagenes 

    router.post("/documents",isUser, upload.single("file"), async(req,res)=>{
        try{
            const file= req.file
            if(file){
                const info= req.body.documents
                const updateDocument = { name: info, reference: file.path }

                const updatedUser= await user.findOneAndUpdate({email:req.session.user.userName, "documents.name":info},  { $pull: { documents: { name: info } } }, {new:true})
                if(updatedUser){
                    await user.findOneAndUpdate({email:req.session.user.userName}, {$push: {documents: updateDocument}}, {new:true})
                }else{
                    await user.findOneAndUpdate({email:req.session.user.userName}, {$push: {documents: updateDocument}}, {new:true})
                }

                
            }
        }catch(err){
            throw new errorManager(dictionary.uploadError)
        }

    })


    return router

}


export default usersRoutes




