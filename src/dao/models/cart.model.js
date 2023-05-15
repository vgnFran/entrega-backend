import mongoose from "mongoose";

const collection= "carts"

const schema= new mongoose.Schema({
    id: Number,
    products: [{
        product: String,
        quantity: Number
    }]
});



const cartModel= mongoose.model(collection,schema)

export default cartModel