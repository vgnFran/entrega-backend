import { Router } from "express";
import { __dirname } from "../../utils.js";
import ProductsManagerDB from "../dao/productManagerDB.js";
import Users from "../dao/usersManager.js";
import user from "../dao/models/users.model.js";
import { hashing, compareHash, validate } from "../../utils.js";
import passport from "../config/passport.config.js"
import initializePassport from "../config/passportGithub.config.js";
import { newToken, authToken} from "../config/jwt.config.js";

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
        res.clearCookie("cookie")
        res.redirect(`http://localhost:8080`)
        
    }) 



    router.post("/login", async (req,res)=>{
        const {login_email, login_password} = req.body
        const user= await users.validate(login_email,login_password)



        const { userName, password, name, rol } = user
        const dataUser= {userName:userName, password:password, name:name, rol:rol}
        console.log()
    
        if(user === null){
            req.sessionStore.userValidated= false
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Ingrese Usuario y Clave';
        }else{

                if(compareHash(user,login_password)){
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
        const {name,surName, password, email, age} = req.body
        const newUser= {name:name, email: email,surName: surName, password: hashing(password), rol:"usuario", age:age}
        await user.create(newUser)
        console.log(newUser)
        if (name != undefined && email != undefined && password != undefined){
            req.sessionStore.userValidated=true
            delete newUser.password
            req.sessionStore.user= newUser
            const token= newToken(newUser,"24h")
            console.log(token)
            res.cookie("cookie",token,{
                httpOnly:true,
                secure:false
            }).redirect("/")
        }   

    })
    //endpoints para validar usuario con jwt y headers
    router.get("/private", authToken, async (req,res)=>{
        res.send(req.user)

    })

    router.get("/current1", passport.authenticate('tokenAuth', { session: false }), async (req,res)=>{
        console.log("validacion por token ok")
        res.status(200).send(req.user)
    
    })

    //endpoint para validar usuario por cookies
    router.get("/current", passport.authenticate('jwtAuth', { session: false }), async (req,res)=>{
        console.log("validacion por cookies ok")
        res.status(200).send(req.user)
    
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




