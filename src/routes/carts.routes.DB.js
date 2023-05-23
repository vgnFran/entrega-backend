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
        const found= await cartModel.findOneAndUpdate(
            {_id:req.params.cid, "products._id":req.params.pid },
            {$inc: {"products.$.quantity": 1}},
            {new: true}
                        
        )
        
        if(found){
            res.status(200).send(found)
        }

    }catch{
            
        const newProduct= {quantity:1}
        const updateCart= await cartModel.findOneAndUpdate(
            {_id:req.params.cid},
            {$push: {products: newProduct} },
            {new: true}
        )
        res.status(200).send(updateCart)
    } 
       
})

router.delete("/carts/:cid/products/:pid", async (req,res)=>{
    
    try{
        const deleteProduct= await cartModel.findOneAndUpdate(
            {_id:req.params.cid},
            {$pull: {products: {_id:req.params.pid}}},
            {new: true}
        )
        res.status(200).send(deleteProduct)
    }catch(err){
        res.status(400).send("Cart o product incorrecto")
    }
    
    
})

router.put("/carts/:cid/products/:pid", async (req,res)=>{

    try{
        const updateQuantity= await cartModel.findOneAndUpdate(
            {_id:req.params.cid, "products._id":req.params.pid },
            {$set: {"products.$.quantity": req.body.quantity}},
            {new:true}
        )
        res.status(200).send(updateQuantity)
    }catch{
        res.status(400).send("Cart o product incorrecto")
    }
    
})


router.delete("/carts/:cid", async (req,res)=>{
    try{
        const deleteProducts= await cartModel.findOneAndUpdate(
            {_id:req.params.cid},
            {$set: {products:[]}},
            {new: true}
        ) 
        res.send(deleteProducts)
    }catch{
        res.send("no")
    }
})
      
     

    
    

    








export default router