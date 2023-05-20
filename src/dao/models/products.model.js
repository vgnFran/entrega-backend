import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

mongoose.pluralize(null)

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


schema.plugin(mongoosePaginate)
const productModel= mongoose.model(collection,schema)

export default productModel