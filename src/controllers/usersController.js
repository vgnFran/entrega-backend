import user from "../models/dao/models/users.model.js";
import Users from "../services/usersManager.js";
import errorManager from "../services/errorManager.js";
import { dictionary } from "../utils/dictionary.js";
import { newToken } from "../auth/jwt.config.js";
import jwt from "jsonwebtoken";
import { compareHash, hashing } from "../utils/utils.js";
const User= new Users() //clase

export const checkUser= async (req,res)=>{
    try{
       
        if( await User.checkUser(req,res) != null){
            const data= await User.checkUser(req,res)
            res.render("products",{products:data.products, user: data.user})
        }else{
            res.render("login",{sessionInfo: req.sessionStore})
        }

    }catch(err){
        req.logger.error(err)
        next(err)
    }
}
    

export const login= async (req,res)=>{
    try{
        const {login_email, login_password} = req.body
        console.log(req.body)
        const userLogg= await User.login(login_email, login_password,req,res)
        res.redirect(`http://localhost:8080`)
    }catch(err){
        req.logger.error(err)
        next(err)
    }
    
}

export const logout= async (req,res)=>{
    try{
        User.logout(req,res)
        res.redirect(`http://localhost:8080`)
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const registerRender= async (req,res)=>{
    try{
        res.render("register")
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const register= async (req,res)=>{
    try{
        const {name,surName, password, email, age} = req.body
        const newUser= await User.register(name,surName,password,email,age,req,res)
        req.logger.info(newUser)
        res.send(newUser)
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const validateToken= async (req,res)=>{
    try{
        res.status(200).send(req.user)
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const passportValidateToken= async (req,res)=>{
    try{
        req.logger.info("validacion por token ok")
        res.status(200).send(req.user)
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const passportValidateCookies= async(req,res)=>{
    try{
        req.logger.info("validacion por cookies ok")
        res.status(200).send(req.user)
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const regFail= async (req,res)=>{
    try{
        res.render('registerError');
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const isAdmin= async (req,res, next)=>{
    try{
        if(await User.isAdmin(req) == "admin" || await User.isAdmin(req) == "premium"){
            next()
        }
    }catch(err){ 
        next(err)
    }
}

export const isUser= async (req,res, next)=>{
    try{
        if(await User.isUser(req) == "usuario"){
            next()
        }
    }catch(err){    
        next(err)
    }
}


export const loggerTest= async (req,res)=>{
    try{
        req.logger.error("Test log (error), en consola en modo DEV, y en consola y archivo en modo PROD")
        res.send({test:"test winston"})

    }catch(err){
        req.logger.error(err)
        next(err)
    }
}


export const changeRol= async (req,res,next)=>{
    try{
        const modifiedRole= await  User.changeRol(req,res)
        res.send(modifiedRole)
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}


export const restore= async(req,res,next)=>{
    try{
        res.render("restore")
    }catch(err){
        req.logger.error(err)
        throw new errorManager(dictionary.notFound)
    }
}


let token= ""
export const rest= async(req,res,next)=>{
    try{
        const {login_email}= req.query
        const findUser= await User.findUser(login_email)

        if(findUser){
            token= newToken({user:findUser.email},"5min")
            User.mailToUser(login_email)

        }else{
            throw new errorManager(dictionary.notFound)    
        }
       
    }catch(err){
        next(err)
    }
}

export const recovery= async (req,res,next)=>{
    try{
        jwt.verify(token,"abc123", (err,credentials)=>{
            if(err){
                req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Tiempo de recuperacion expirado';
                res.redirect(`http://localhost:8080`)
            }else{
                res.render("newPass",{credentials}) 
            }
        })
    }catch(err){
        throw new errorManager(dictionary.notFound)
    }
}

export const newPass= async (req,res,next)=>{
    try{
        const {pass, confirmedPass, email}= req.query
        const currentPass= await user.findOne({email:email})
        const passw= compareHash(currentPass,pass )

        if( (pass == confirmedPass) && (passw != true) ){
            User.newPass(pass,email,currentPass,req,res)
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
}