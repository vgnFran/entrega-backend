import { Router } from "express";
import ProductsManagerDB from "../dao/productManagerDB.js";
import productModel from "../dao/models/products.model.js";
import { validate } from "../../utils.js";

const router= Router()
const manager=new ProductsManagerDB


    router.get("/products/:id",async (req,res)=>{    
        res.status(200).send(await manager.getProductsById(req.params.id))
    })
    
        // CON EL ENDPOINT /PRODUCTS TRAEMOS TODOS LOS PRODUCTOS
        // CON EL ENDPOINT /PRODUCTS/ID TRAEMOS SOLO EL PRODUCTO CON ESE ID 
        // CON EL ENDPOINT /PRODUCTS?QUERY=QUERY TRAEMOS LOS PRODUCTOS FILTRADOS CON LA CATEGORIA PASADA POR QUERY, POR EJEMPLO: /PRODUCTS?QUERY=NOTEBOOK TRAEMOS SOLO LAS NOTEBOOKS
        //EJ: http://localhost:8080/api/products?category=notebook&limit=1&page=2&sort=-1 FILTRAMOS POR NOTEBOOK, LIMITE DE 1 PRODUCTO, PAGINA 2 Y PRECIO DESCENDENTE


    router.get("/products?", async (req,res)=>{
            
        try{        
            if(req.query.category != undefined){

                const process= await productModel.paginate( {category:req.query.category},{page:req.query.page, limit:req.query.limit || 10, sort:{price:req.query.sort}})
                res.status(200).send(process)
            }
            else{            
                res.status(200).send(await manager.getProducts())
            }                       
        }catch(err){
            console.log(err)

        }
    })

    router.get("/productsViews?",async (req,res)=>{

        try{
            if(req.query.category != undefined){

                const docs= await productModel.paginate( {category:req.query.category},{page:req.query.page, limit:req.query.limit || 10, sort:{price:req.query.sort},lean:true})
                const products= docs.docs
                res.render("products",{products})
            }
            else{
                const products= await manager.getProducts()            
                res.render("products",{products})
            }  
        }catch(err){
            res.send(err)
        }
        
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