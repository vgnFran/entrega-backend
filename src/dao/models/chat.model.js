import mongoose, { Schema } from "mongoose";


const schema= new Schema({
    user:String,
    message:String
})

const chatModel= mongoose.model("messages",schema)

export default chatModel