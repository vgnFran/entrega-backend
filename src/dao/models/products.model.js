import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

mongoose.pluralize(null)

const schema= new Schema({
    title: {type:String,required:[true,"title is required"]},
    id: {type:String},
    description: {type:String,required:[true,"description is required"]},
    code: {type:Number,required:[true,"code is required"]},
    price: {type:Number,required:[true,"price is required"]},
    status: Boolean,
    stock: {type:Number,required:[true,"number is required"]},
    category: {type:String,required:[true,"category is required"]},
    thumbnail: String
});



schema.plugin(mongoosePaginate)
const productModel= mongoose.model("products",schema)

export default productModel