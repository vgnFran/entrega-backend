import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import productModel from "./products.model.js";

mongoose.pluralize(null);


const schema= new Schema({
    
  products: [{
      pid: {type: Schema.Types.ObjectId, ref:"products"},
      quantity: {type: Number, default:1},
      product: {type: String, ref: "products"},
      
  }]
  
});

schema.plugin(mongoosePaginate);

const cartModel = mongoose.model("carts", schema);

export default cartModel;