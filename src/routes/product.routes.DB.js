import { Router } from "express";
import ProductsManagerDB from "../dao/productManagerDB.js";

const router= Router()
const manager=new ProductsManagerDB




    router.get("/products",async (req,res)=>{
        try{
            const products= await manager.getProducts()
            res.status(200).send(products)
        }catch(err){
            console.log(err)
            res.status(400).send("error")
        }
    })


    router.get("/products/:id",async (req,res)=>{
        
        res.status(200).send(await manager.getProductsById(req.params.id))
    })


    router.post("/products", async (req,res)=>{

       try{
            res.status(200).send(await manager.createProduct(req.body))
       }catch(err){
            res.status(400).send("error")
       }

    })

    router.put("/products/:id", async (req,res)=>{
        try{           
            res.status(200).send(await manager.updateProduct(req.params.id,req.body))
        }catch(err){
            res.status(400).send(err)
        }
    })

    router.delete("/products/:id", async (req,res)=>{
        try{
            res.status(200).send(await manager.deleteProduct(req.params.id))
        }catch(err){
            res.status(400).send(err)
        }
    })







export default router