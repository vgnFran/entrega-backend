import { Router } from "express";
import { __dirname } from "../../utils.js";
import ProductsManagerDB from "../dao/productManagerDB.js";
import Users from "../dao/usersManager.js";
import userModel from "../dao/models/users.model.js";
import { hashing, compareHash, validate } from "../../utils.js";
import passport from "../config/passport.config.js"
import initializePassport from "../config/passportGithub.config.js";

initializePassport()

const manager= new ProductsManagerDB()

const usersRoutes=()=>{
    const router=Router()
    const users=new Users()
    
    

    router.get("/", async (req,res)=>{

        if(req.sessionStore.userValidated == true){
            const products=  await manager.getProducts()
            res.render("products",{products:products, user:req.sessionStore.user})
        }else if(req.session.user){
            req.session.userValidated=true
            const products=  await manager.getProducts()
            res.render("products",{products: products, user: req.session.user })
        }        
        else{
            res.render("login",{
                sessionInfo: req.sessionStore
            })
        }
        
    })


    router.get("/logout",async (req,res)=>{
        req.sessionStore.userValidated=false
        req.session.destroy()
        res.redirect(`http://localhost:8080`)
    })



    router.post("/login", async (req,res)=>{
        const {login_email, login_password} = req.body
        const user= await users.validate(login_email,login_password)



        const { userName, password, name, rol } = user
        const dataUser= {userName:userName, password:password, name:name, rol:rol}
        
    
        if(user === null){
            req.sessionStore.userValidated= false
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Ingrese Usuario y Clave';
        }else{

                if(compareHash(user,login_password)){
                    req.sessionStore.userValidated=true
                    req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
                    req.sessionStore.user= dataUser    
                }else{
                    req.sessionStore.userValidated= false
                    req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Usuario o Clave no validos';
                }

        }
        
        res.redirect(`http://localhost:8080`)

    })


    router.get("/register", async(req,res)=>{
        res.render("register")
    })


    router.post("/register", passport.authenticate('authRegister', { failureRedirect: '/regfail' }) ,async (req,res)=>{
        const {name,surName, userName, password} = req.body
        const newUser= {name:name, userName: userName,surName: surName, password: hashing(password), rol:"usuario"}
        console.log(newUser)
        await userModel.create(newUser)
        if (name != undefined && userName != undefined && password != undefined){
            req.sessionStore.userValidated=true
            req.sessionStore.user= newUser
            res.redirect("/")
        }
    })


    router.get("/regfail", async (req,res)=>{
        res.render('registerError');
    })

    router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => {
    });

    router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });
   



    return router

}

export default usersRoutes




