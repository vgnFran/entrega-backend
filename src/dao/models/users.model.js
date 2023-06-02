import mongoose from "mongoose";

const collection= "users"

const schema= new mongoose.Schema({
    userName:{type:String, required:true},
    password:{type:String, required:true},
    name: String,
    rol: String
})

const userModel= mongoose.model(collection,schema)

export default userModel