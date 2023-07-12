import { Router } from "express";
import { __dirname } from "../../utils.js";
import passport from "../auth/passport.config.js"
import initializePassport from "../auth/passportGithub.config.js";
import { newToken, authToken} from "../auth/jwt.config.js";
import { checkUser, login, logout, passportValidateCookies, passportValidateToken, regFail, register, registerRender, validateToken, isAdmin } from "../controllers/usersController.js";
import Ticket from "../services/ticketManager.js";


import nodemailer from "nodemailer"
import twilio from "twilio"
import config from "../config/config.js"
import cartModel from "../models/dao/models/cart.model.js";
import productModel from "../models/dao/models/products.model.js";
import Carts from "../services/cartsManagerDB.js";



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


    // const trasport= nodemailer.createTransport({
    //     service:"gmail",
    //     port:587,
    //     auth:{
    //         user:"vgnfran.dev@gmail.com",
    //         pass:config.GOOGLEAPP
    //     }
    // })
   
    // router.get("/mail", async (req,res)=>{
    //     const result= await trasport.sendMail({
    //         from:"Test <vgnfran.dev@gmail.com>",
    //         to:"zkay3600@gmail.com",
    //         subject:"to: maurito",
    //         html:`
    //         <h1>Test mail desde endpoint </h1>
    //         <p>Hola gordo te estoy mandando desde mi backend jujuu </p>
    //         <img src="cid:coder" style= "width:200px"/>
    //         `,
    //         attachments:[{
    //             filename:"coder.jpg", path:`${__dirname}/src/images/coder.png`, cid:"coder" 
    //         }]
    //     })
    //     res.send(result)
    // })

    // const client= twilio("ACc907d0aeb1f86cf1d08376c3cabb011e","7039bd387ac0412dbd40d584e9799a7c")


    // router.get("/sms", async (req,res)=>{
    //     let result= await client.messages.create({
    //         body:"hola profe probando",
    //         from:"+12058807562",
    //         to: "+5493492522778"     
    //     })
    //     res.send(result)
    // })
    
    // const ticket= new Ticket
    // router.get("/ticket",async (req,res)=>{
    //     res.send(await ticket.getTickets())
    // })

    router.get("/ticket",async (req,res)=>{

       
        const idCart= req.session.user.cart._id
        

        res.send({
            user: req.session.user.userName,
            cart: await cartModel.findById(idCart).populate("products._id")

        })
        

    })

    

    return router

}

export default usersRoutes




