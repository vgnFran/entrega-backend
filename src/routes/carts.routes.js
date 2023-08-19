import { Router } from "express"
import cartsManagerDB from "../services/cartsManagerDB.js"
import cartModel from "../models/dao/models/cart.model.js"
import { cartProducts, cartViews, deleteProductInCart, deleteProducts, getCarts, newCart, productsInCart, updateQuantity } from "../controllers/cartsController.js"
import { isUser } from "../controllers/usersController.js"

const router= Router()
const manager= new cartsManagerDB


router.get("/carts",getCarts)


router.post("/carts",newCart)



router.get("/carts/:id",cartProducts)




router.post("/carts/:cid/products/:pid", productsInCart)



router.delete("/carts/:cid/products/:pid", deleteProductInCart)


router.put("/carts/:cid/products/:pid",updateQuantity)


router.delete("/carts/:cid", deleteProducts)


router.get("/cartsviews/:cid", cartViews)
      
     

    
    

    








export default router