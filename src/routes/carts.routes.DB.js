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

router.post("/carts/:cid/products/:pid", async (req,res)=>{

    res.send(await manager.cartsInCart(req.params.cid,req.params.pid))

    
})




export default router