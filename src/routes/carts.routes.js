import { Router } from "express"
import CartManager from "../managers/cartsManagerFS.js"


const router= Router()
const manager= new CartManager("./src/carts.json")

router.post("/carts", (req,res)=>{
    res.status(200).send(manager.newCart())
    
})

router.get("/carts/:id",(req,res)=>{

    if(manager.cartProducts(req.params.id)){
        res.status(200).send(manager.cartProducts(req.params.id))
    }else{
        res.status(404).send(`cart:${req.params.id} does not exist in the database`)
    }
    
})

router.post("/carts/:cid/products/:pid",(req,res)=>{
    
    
    res.status(200).send(manager.cartsInCart(req.params.cid,req.params.pid))           
})




export default router