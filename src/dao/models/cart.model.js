import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


mongoose.pluralize(null)


const schema= new Schema({


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



const cartModel= mongoose.model("carts",schema)

export default cartModel