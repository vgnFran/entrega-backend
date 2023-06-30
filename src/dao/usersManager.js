import crypto from 'crypto';
import mongoose from 'mongoose';
import user from './models/users.model.js';

class Users {

    constructor(){
        this.users=[]
    }

    validate= async (user,pass)=>{
        try{
            return await user.findOne({email:user})
        }catch(err){
            console.log(err)
        }
    }

}

export default Users