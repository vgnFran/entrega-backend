import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

mongoose.pluralize(null)

const schema= new Schema({
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
const productModel= mongoose.model("products",schema)

export default productModel