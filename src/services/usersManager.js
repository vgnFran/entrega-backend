import user from "../models/dao/models/users.model.js"
import { hashing, compareHash } from "../../utils.js"
import { newToken, authToken } from "../auth/jwt.config.js"
import productModel from "../models/dao/models/products.model.js"

class Users {

    constructor(){
        this.users=[]
    }

    validate= async (userMail,pass)=>{
        try{
            return await user.findOne({email:userMail})
        }catch(err){
            console.log(err)
        }
    }

    register= async (name,surName,password,email,age)=>{
        const newUser= {name:name, email: email,surName: surName, password: hashing(password), rol:"usuario", age:age}
        
        console.log(newUser)
        if (name != undefined && email != undefined && password != undefined){
            await user.create(newUser)
            req.sessionStore.userValidated=true
            delete newUser.password
            req.sessionStore.user= newUser
            const token= newToken(newUser,"24h")
            console.log(token)
            return newUser
        }
    }

    logout= async(req,res)=>{
        req.sessionStore.userValidated=false
        req.session.destroy()
        res.clearCookie("cookie")
    }

    login= async (login_email, login_password,req,res)=>{
        req.sessionStore.errorMessage = req.sessionStore.errorMessage = '';
        const newUser= await this.validate(login_email, login_password)
        const { userName, password, name, rol, email } = newUser
        const dataUser= {userName:email, password:password, name:name, rol:rol}
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

}

export default Users