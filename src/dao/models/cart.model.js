import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const collection= "carts"

const schema= new mongoose.Schema({


    // products:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"products"

    // }]

    products: [{
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "products"
          },
          quantity: {
            type: Number,
          }
        }]

});

schema.plugin(mongoosePaginate)

const cartModel= mongoose.model(collection,schema)

export default cartModel