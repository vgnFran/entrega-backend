import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);


const schema= new Schema({
    email:{type:String, required:[true,"email is required"]},
    surName: {type:String, required:[true,"surname is required"]},
    name: {type:String, required:[true,"name is required"]},
    password:{type:String, required:[true,"password is required"]},
    age:{type:Number},
    rol: String
})
const user= mongoose.model("users",schema)

export default user