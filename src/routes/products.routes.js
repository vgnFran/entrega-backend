import { Router } from "express"
import ProductsManager from "../managers/productManagerFS.js"


const productsRoutes=(io)=>{

    const router= Router()
    const manager=new ProductsManager("./src/products.json")


    router.get("/products",(req,res)=>{
        res.status(200).send(manager.fsProducts())
    })
   
    
    router.get("/products/:id",(req,res)=>{
        
        if(manager.getProductsById(req.params.id)){
            res.status(200).send(manager.getProductsById(req.params.id))
        }else{
            res.status(404).send({
                id:req.params.id,
                product: `product ${req.params.id} does not exist in the database`
            })
        }
        
    })
    
    
    
    router.post("/products", (req,res)=>{
    
            
        // verificamos si todos los imputs estan completos, si hay alguno incompleto la validacion sera true
        const values = Object.values(manager.createProduct(req.body))
        const completeImputs= values.map(val=>{
            return val== null
        })
      
        // verificamos si el codigo del nuevo producto ya existe
        const repited= manager.fsProducts().find(prod=>{
            return prod.code == req.body.code
        })


        if (completeImputs.includes(true)){
            res.status(404).send("Incomplete field")
        }else if (repited){
            res.status(404).send("The product alredy exists in the database")
        }else{
            res.status(200).send(manager.createProduct(req.body))
        }
        
    })
    
    
    router.put("/products/:id",(req,res)=>{
    
        const update=manager.getProductsById(req.params.id)
        if (update){            
            res.status(200).send(manager.updatePoduct(update,req.body))
        }else{
            res.status(404).send(`the product ${req.params.id} does not exist`)
        }
        
        
    })
    
    
    
    router.delete("/products/:id",(req,res)=>{
    

        const deleted= manager.fsProducts().find(prod=>{
            return prod.id == req.params.id
        }) 

        if(deleted){
            manager.deleteProduct(deleted)
            res.status(200).send("Product deleted")
        }else{
            res.status(404).send(`The product with the id:${req.params.id} does not exist in the database`)
        }
    
    })
    
    //endpoints handlebars
    
    router.get("/home",(req,res)=>{
        res.render("home",{productsParse})
    })
    
    
    router.post("/realtimeproducts",(req,res)=>{
        res.render("realTimeProducts",{productsParse})
        io.emit("newProduct",req.body)
    })
    
    return router
}

export default productsRoutes


 


