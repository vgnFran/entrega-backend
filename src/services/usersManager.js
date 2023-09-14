import user from "../models/dao/models/users.model.js"
import { hashing, compareHash } from "../utils/utils.js"
import { newToken, authToken } from "../auth/jwt.config.js"
import productModel from "../models/dao/models/products.model.js"
import errorManager from "./errorManager.js"
import { dictionary } from "../utils/dictionary.js"
import nodemailer from "nodemailer"
import {config} from "../config/config.js"

class Users {

    constructor(){
        this.users=[]
        this.currentUser= ""
    }

    validate= async (userMail,pass)=>{
        try{
            return await user.findOne({email:userMail}).populate("cart")
        }catch(err){
            req.logger.error(err)
            throw new errorManager(dictionary.notFound)
        }
    }

    register= async (name,surName,password,email,age,req,res)=>{
        const newUser= {name:name, email: email,surName: surName, password: hashing(password), rol:"usuario", age:age}
        req.logger.info(newUser)
        if (name != undefined && email != undefined && password != undefined){
            const registered = await user.create(newUser)
            req.sessionStore.userValidated=true
            delete newUser.password
            req.sessionStore.user= newUser
            const token= newToken(newUser,"24h")
            req.logger.info(token)
            return registered
        }else{
            throw new errorManager(dictionary.notFound)
        }
    }
    logout= async(req,res)=>{
        req.sessionStore.userValidated=false
        req.session.destroy()
        res.clearCookie("cookie")
        console.log()
        // await user.findOneAndUpdate({email:req.sessionStore.user.userName}, {lastConnection: new Date()}, {new:true})
    }

    login= async (login_email, login_password,req,res)=>{
        req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
        const newUser= await this.validate(login_email, login_password)
        const { userName, password, name, rol, email, cart } = newUser
        const dataUser= {userName:email, password:password, name:name, rol:rol, cart:cart}
        // req.logger.info(dataUser)
        if(newUser === null){
            req.sessionStore.userValidated= false
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Ingrese Usuario y Clave';
            return null
        }else{
            if(compareHash(newUser,login_password)){
                req.sessionStore.userValidated=true
                req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
                delete dataUser.password
                req.sessionStore.user= dataUser 
                req.session.user=dataUser
                const token= newToken(dataUser,"24h")            
                await user.findOneAndUpdate({email:dataUser.userName}, {lastConnection: new Date()}, {new:true})
                res.cookie("cookie",token,{
                    httpOnly:true,
                    secure:false
                })
                return dataUser
                
            }else{
                req.sessionStore.userValidated= false
                
                return req.sessionStore.errorMessage = req.sessionStore.errorMessage = 'Usuario o Clave no validos';
            }

        }
    }

    checkUser= async(req,res)=>{
        const products= await productModel.find().lean()
        if(req.sessionStore.userValidated){
            return {
                products: products,
                user: req.sessionStore.user
            }
        }else if(req.session.user){
            return {
                products: products,
                user: req.session.user
            }
        }else{
            return null
        }
    }

    isAdmin= async(req,res)=>{
        const user= req.session.user
        if(user){            
            return user.rol
        }else{
            throw new errorManager(dictionary.unauthorized)
        }
    }

    isUser= async(req,res)=>{
        const user= req.session.user
        console.log(user)
        if(user){            
            return user.rol
        }else{
            throw new errorManager(dictionary.unauthorized)
        }
    }

    changeRol= async(req,res)=>{
        if(!req.session.user || !req.sessionStore.user) throw new errorManager(dictionary.unauthorized) 

        const currentUser= req.session.user
        if(currentUser.rol == "usuario"){
            const updated= await user.findOneAndUpdate({email:currentUser.userName}, {rol: "premium"}, {new:true})
            req.session.user= {
                userName: updated.email,
                name: updated.name,
                rol: updated.rol,
                cart: updated.cart
            }
            return req.session.user
        }else if(currentUser.rol == "premium"){
            const updated= await user.findOneAndUpdate({email:currentUser.userName}, {rol: "usuario"}, {new:true})
            req.session.user= {
                userName: updated.email,
                name: updated.name,
                rol: updated.rol,
                cart: updated.cart
            }
            return req.session.user
        }else{
            throw new errorManager(dictionary.notFound)         
        }
    }

    changeRolUid= async(req,res)=>{
        try{
            const findUser= await user.findOne({_id:req.params.uid})

            const premium= findUser.documents.filter(document=>{
                return document.name == "comprobanteDomicilio" || document.name == "identificacion" || document.name == "comprobanteEstadoCuenta"
            })

            if(findUser.rol == "premium"){
                const updated= await user.findOneAndUpdate({_id:req.params.uid}, {rol:"usuario"}, {new:true})
                return updated
            }else if(premium.length == 3){
                const updated= await user.findOneAndUpdate({_id:req.params.uid}, {rol:"premium"}, {new:true})
                return updated
            }else{
                throw new errorManager(dictionary.unauthorized)
            }

        }catch(err){
            throw new errorManager(dictionary.nonExistent)
        }
    }

    findUser= async (email)=>{
        try{
            return await user.findOne({email:email})
        }catch{
            throw new errorManager(dictionary.nonExistent)
        }
    }

    mailToUser= async (email)=>{
        try{
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
                to:email,
                subject:"Recuperacion de Contraseña",
                html:`
                <h1>Recuperacion de contraseña </h1>
                <p>haga click en el siguiente link para recuperar su contraseña </p>
                <a href="http://localhost:8080/recovery">RECUPERAR</a>.
                `,
            })
        }catch{
            throw new errorManager(dictionary.wrongUser)
        }
    }

    newPass= async (pass,email,currentPass,req,res)=>{
        try{
            const newPassword = hashing(pass)
            await user.findOneAndUpdate({email:email}, {password:newPassword})
            const dataUser= {userName:currentPass.email, password:currentPass.password, name:currentPass.name, rol:currentPass.rol, cart:currentPass.cart}
            req.sessionStore.userValidated=true
            req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
            delete dataUser.password
            req.sessionStore.user= dataUser 
            req.session.user=dataUser
            const token = newToken(dataUser,"24h")
            res.cookie("cookie",token,{
                httpOnly:true,
                secure:false
            })
        }catch(err){
            throw new errorManager(dictionary.notFound)
        }
    } 
    

    getUsers= async()=>{
        try{
            const allUsers= await user.find()
            const newUsers = allUsers.map(user=>{
                return {name:user.name, email:user.email, accountType: user.rol, lastConnection:user.lastConnection.toLocaleString()}
            })
            return newUsers
        }catch(err){
            throw new errorManager(dictionary.notFound)
        }
    }

    deleteUsers= async()=>{
        try{

            const horaActual = new Date()
            const cutoffDate = new Date(horaActual)
            cutoffDate.setDate(cutoffDate.getDate() - 2)
            
            const usuariosAEliminar = await user.find({
                lastConnection: { $lt: cutoffDate }
            })

            if(usuariosAEliminar.length > 0){
                await user.deleteMany({ _id: { $in: usuariosAEliminar.map(user => user._id) } })
                console.log(`Se eliminaron ${usuariosAEliminar.length} usuarios`)
            }else{
                console.log("No hay usuarios para eliminar")
            }

            return usuariosAEliminar

        }catch(err){
            throw new errorManager(dictionary.notFound)
        }
    }



}

export default Users