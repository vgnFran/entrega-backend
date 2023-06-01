import { Router } from "express";
import { __dirname } from "../../utils.js";
import ProductsManagerDB from "../dao/productManagerDB.js";
import Users from "../dao/usersManager.js";


const manager= new ProductsManagerDB()

const usersRoutes=()=>{
    const router=Router()
    const users=new Users()
    

    router.get("/", async (req,res)=>{


        const products= await manager.getProducts()


        if(req.sessionStore.userValidated == true){

            res.render("products",{products:products})
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

        if(user === null){
            req.sessionStore.userValidated= false
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Usuario o clave no válidos';

        }else{
            req.sessionStore.userValidated=true
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
        }

        res.redirect(`http://localhost:8080`)
        
    })




    return router

}

export default usersRoutes