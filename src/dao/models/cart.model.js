import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const collection= "carts"

const schema= new mongoose.Schema({
    id: Number,
    products: [{
        product: String,
        quantity: Number
    }]
});

schema.plugin(mongoosePaginate)

const cartModel= mongoose.model(collection,schema)

export default cartModel