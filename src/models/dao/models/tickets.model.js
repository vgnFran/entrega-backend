import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null)

const schema= new Schema({
    
    code: {type: String},
    purchase_datetime: {type: String},
    amount: {type: Number},
    purchaser: {type: String},
    message: {type: String}
});




const ticketModel= mongoose.model("tickets",schema)

export default ticketModel