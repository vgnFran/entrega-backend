import crypto from 'crypto';
import mongoose from 'mongoose';
import userModel from './models/users.model.js';

class Users {

    constructor(){
        this.users=[]
    }

    validate= async (user,pass)=>{
        try{
            return await userModel.findOne({userName:user})
        }catch(err){
            console.log(err)
        }
    }

}

export default Users