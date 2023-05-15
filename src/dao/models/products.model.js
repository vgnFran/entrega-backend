import mongoose from "mongoose";

const collection= "products"

const schema= new mongoose.Schema({
    title: String,
    id: String,
    description: String,
    code: Number,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String
});



const productModel= mongoose.model(collection,schema)

export default productModel