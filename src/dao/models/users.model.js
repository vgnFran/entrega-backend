import mongoose from "mongoose";

mongoose.pluralize(null);

const collection= "users"

const schema= new mongoose.Schema({
    email:{type:String, required:true},
    surName: {type:String, required:true},
    name: {type:String, required:true},
    password:{type:String},
    rol: String
})

const userModel= mongoose.model(collection,schema)

export default userModel