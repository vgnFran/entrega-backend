import { Router } from "express";
import { __dirname } from "../../utils.js";
import ProductsManagerDB from "../dao/productManagerDB.js";
import Users from "../dao/usersManager.js";
import userModel from "../dao/models/users.model.js";


const manager= new ProductsManagerDB()

const usersRoutes=()=>{
    const router=Router()
    const users=new Users()
    
    

    router.get("/", async (req,res)=>{

        if(req.sessionStore.userValidated == true){
            const products=  await manager.getProducts()
            res.render("products",{products:products, user:req.sessionStore.user})
        }else{
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
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Usuario o clave no válidos';
        }else{
            req.sessionStore.userValidated=true
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
            req.sessionStore.user= dataUser    
        }
        
        res.redirect(`http://localhost:8080`)
        
    })


    router.get("/register", async(req,res)=>{
        res.render("register")
    })


    router.post("/register", async (req,res)=>{
        const {name,surName, userName, password} = req.body
        const newUser= {name:name, userName: userName,surName: surName, password:password, rol:"usuario"}
        console.log(newUser)
        await userModel.create(newUser)
        if (name != undefined && userName != undefined && password != undefined){
            req.sessionStore.userValidated=true
            req.sessionStore.user= newUser
            res.redirect("/")
        }
    })




    return router

}

export default usersRoutes




