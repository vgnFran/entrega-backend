import { Router } from "express"
import cartsManagerDB from "../dao/cartsManagerDB.js"
import cartModel from "../dao/models/cart.model.js"
import mongoose from "mongoose"

const router= Router()
const manager= new cartsManagerDB

router.get("/carts", async (req,res)=>{
    try{
        res.status(200).send(await manager.getCarts())
    }catch(err){
        res.status(400).send(err)
    }
})

router.post("/carts", async (req,res)=>{
    try{
        res.status(200).send(await manager.newCart())
    }catch(err){
        res.status(400).send(err)
    }
})

router.get("/carts/:id", async (req,res)=>{
    try{
        res.status(200).send(await manager.cartProducts(req.params.id))
    }catch(err){
        res.status(400).send(err)
    }
})


// router.post("/carts/:id", async (req,res)=>{
//     try{
//         const product= await manager.cartProducts(req.params.id)
        
//         res.send(await cartModel.findByIdAndUpdate({_id:"64681e23601a46e9e95bfb94"},{products:{quantity:20}}))
        
        
//     }catch{
//         res.status(400).send(err)
//     }
// })




router.post("/carts/:cid/products/:pid", async (req,res)=>{


    try{
        const finded= await cartModel.findOneAndUpdate(
            {_id:req.params.cid, "products._id":req.params.pid },
            {$inc: {"products.$.quantity": 1}},
            {new: true}            
        )
        
        if(finded){
            res.status(200).send(finded)
        }

    }catch{
            
        const newProduct= {quantity:18}
        const updateCart= await cartModel.findOneAndUpdate(
            {_id:req.params.cid},
            {$push: {products: newProduct} },
            {new: true}
        )
        res.status(200).send(updateCart)
    } 
       
})        
      
     

    
    

    








export default router