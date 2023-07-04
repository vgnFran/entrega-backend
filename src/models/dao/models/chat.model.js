import mongoose, { Schema } from "mongoose";


const schema= new Schema({
    user:{type:String,required:[true,"user is required"]},
    message:{type:String,required:[true,"message is required"]}
})

const chatModel= mongoose.model("messages",schema)

export default chatModel