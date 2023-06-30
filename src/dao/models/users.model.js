import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);


const schema= new Schema({
    email:{type:String, required:true},
    surName: {type:String, required:true},
    name: {type:String, required:true},
    password:{type:String},
    age:{type:Number},
    rol: String
})
const user= mongoose.model("users",schema)

export default user