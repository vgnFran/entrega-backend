import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null)

const schema= new Schema({
    
    products: [{
        product: {type: Schema.Types.ObjectId, ref:"products"},
        quantity: {type: Number, default:1}
    }]
});




const ticketModel= mongoose.model("tickets",schema)

export default ticketModel