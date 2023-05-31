import crypto from 'crypto';
import mongoose from 'mongoose';
import userModel from './models/users.model.js';

class Users {

    constructor(){
        this.users=[]
    }

    validate= async (user,pass)=>{
        try{
            return await userModel.findOne({userName:user, password:pass})
        }catch(err){
            console.log("no esta en la bbdd")
        }
    }

}

export default Users