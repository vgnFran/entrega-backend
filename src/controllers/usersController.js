import Product from "../services/productManagerDB.js";
import user from "../models/dao/models/users.model.js";
import Users from "../services/usersManager.js";
import { hashing, compareHash } from "../../utils.js";

const products= new Product()
const usersModel= new user() // modelo
const User= new Users() //clase

export const checkUser= async (req,res)=>{
    try{
        if( await User.checkUser(req,res) != null){
            const data= await User.checkUser(req,res)
            res.render("products",{products:data.products, user: data.user})
        }else{
            console.log(req.sessionStore)
            res.render("login",{sessionInfo: req.sessionStore})
        }

    }catch(err){
        res.status(400).send(err)
    }
}
    

export const login= async (req,res)=>{
    try{
        const {login_email, login_password} = req.body
        const userLogg= await User.login(login_email, login_password,req,res)
        res.redirect(`http://localhost:8080`)
    }catch(err){
        res.send(err)
    }
    
}

export const logout= async (req,res)=>{
    try{
        User.logout(req,res)
        res.redirect(`http://localhost:8080`)
    }catch(err){
        res.status(400).send(err)
    }
}

export const registerRender= async (req,res)=>{
    try{
        res.render("register")
    }catch(err){
        res.status(400).send(err)
    }
}

export const register= async (req,res)=>{
    try{
        const {name,surName, password, email, age} = req.body
        const newUser= await User.register(name,surName,password,email,age)
        console.log(newUser)
        res.send(newUser)
    }catch(err){
        res.send(err)
    }
}

export const validateToken= async (req,res)=>{
    try{
        res.status(200).send(req.user)
    }catch(err){
        res.status(400).send(err)
    }
}

export const passportValidateToken= async (req,res)=>{
    try{
        console.log("validacion por token ok")
        res.status(200).send(req.user)
    }catch(err){
        res.status(400).send(err)
    }
}

export const passportValidateCookies= async(req,res)=>{
    try{
        console.log("validacion por cookies ok")
        res.status(200).send(req.user)
    }catch(err){
        res.status(400).send(err)
    }
}

export const regFail= async (req,res)=>{
    try{
        res.render('registerError');
    }catch(err){
        res.status(400).send(err)
    }
}

