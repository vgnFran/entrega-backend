import mongoose from "mongoose";

mongoose.pluralize(null);

const collection= "users"

const schema= new mongoose.Schema({
    userName:{type:String, required:true},
    password:{type:String},
    name: String,
    rol: String
})

const userModel= mongoose.model(collection,schema)

export default userModel