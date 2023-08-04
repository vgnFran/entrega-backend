import { Router } from "express";
import { __dirname } from "../utils/utils.js";
import passport from "../auth/passport.config.js"
import initializePassport from "../auth/passportGithub.config.js";
import { newToken, authToken} from "../auth/jwt.config.js";
import { checkUser, login, logout, passportValidateCookies, passportValidateToken, regFail, register, registerRender, validateToken, isAdmin, loggerTest, changeRol } from "../controllers/usersController.js";
import Ticket from "../services/ticketManager.js";
import { newPurchase } from "../controllers/ticketController.js";


import nodemailer from "nodemailer"
import twilio from "twilio"
import {config} from "../config/config.js"
import cartModel from "../models/dao/models/cart.model.js";
import productModel from "../models/dao/models/products.model.js";
import Carts from "../services/cartsManagerDB.js";
import ticketModel from "../models/dao/models/tickets.model.js";
import jwt from "jsonwebtoken";

import user from "../models/dao/models/users.model.js";
import errorManager from "../services/errorManager.js";
import { dictionary } from "../utils/dictionary.js";
import { compareHash, hashing } from "../utils/utils.js";
import { hash } from "bcrypt";




initializePassport()


const usersRoutes=()=>{
    const router=Router()


    router.get("/", checkUser)

    router.get("/logout",logout)

    router.post("/login", login)

    router.get("/register", registerRender)

    router.post("/register", passport.authenticate("authRegister",{failureRedirect: "/regfail"}), register )

    router.get("/test",isAdmin)



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


    router.get("/restore", async (req,res)=>{
        res.render("restore")
    })

    let token=""

    router.get("/rest", async (req,res,next)=>{
        try{
            const {login_email}= req.query
            const findUser= await user.findOne({email:login_email})
            console.log(findUser)

            if(findUser){
                token= newToken({user:findUser},"5min")

                const trasport= nodemailer.createTransport({
                    service:"gmail",
                    port:587,
                    auth:{
                        user:"vgnfran.dev@gmail.com",
                        pass:config.GOOGLEAPP
                    }
                })

                const result = await trasport.sendMail({
                    from:"vgnfran.dev@gmail.com",
                    to:`${login_email}`,
                    subject:"Recuperacion de Contraseña",
                    html:`
                    <h1>Recuperacion de contraseña </h1>
                    <p>haga click en el siguiente link para recuperar su contraseña </p>
                    <a href="http://localhost:8080/recovery">RECUPERAR</a>.
                    `,
                })

            }else{
                throw new errorManager(dictionary.wrongUser)                
            }
           
        }catch(err){
            next(err)
        }
    })

    router.get(`/recovery`,(req,res)=>{
        jwt.verify(token,"abc123", (err,credentials)=>{
            if(err){
                req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Tiempo de recuperacion expirado';
                res.redirect(`http://localhost:8080`)
            }else{
                res.render("newPass",{credentials}) 
            }
        })
    })

    router.get("/newpass", async (req,res, next)=>{
        try{
            const {pass, confirmedPass, email}= req.query
            const currentPass= await user.findOne({email:email})
            const passw= compareHash(currentPass,pass )

            if( (pass == confirmedPass) && (passw != true) ){
                const newPassword= hashing(pass)
                await user.findOneAndUpdate({email:email}, {password:newPassword})
                const dataUser= {userName:currentPass.email, password:currentPass.password, name:currentPass.name, rol:currentPass.rol, cart:currentPass.cart}
                req.sessionStore.userValidated=true
                req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
                delete dataUser.password
                req.sessionStore.user= dataUser 
                req.session.user=dataUser
                const token= newToken(dataUser,"24h")
                res.cookie("cookie",token,{
                    httpOnly:true,
                    secure:false
                })
                res.redirect("/")
            }else if( passw == true ){
                req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'No se puede utilizar la contraseña restaurada';
                res.render("newPass",{sessionInfo: req.sessionStore, email:email})
            } else if (pass != confirmedPass){
                req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Contraseñas no coinciden';
                res.render("newPass",{sessionInfo: req.sessionStore, email:email})
            }
        }catch(err){
            next(err)
        }
        
    })

    router.get("/users/premium", changeRol )




    return router

}

export default usersRoutes




