import { Router } from "express"
import fs from "fs"



const productsRoutes=(io)=>{

    const router= Router()
    const products=[]
    const productsParse=JSON.parse(fs.readFileSync("./src/products.json"))

    router.get("/products", (req,res)=>{
        if(req.query.limit){
            const limitedProducts= productsParse.filter((prod)=>{
                return prod.id <= req.query.limit
            })
            res.status(200).send(limitedProducts)
        }else{
            res.status(200).send(productsParse)
        }
    })
    
    
    router.get("/products/:id",(req,res)=>{
        
        const searchId= productsParse.find((prod)=>{
            return prod.id == req.params.id
        })
    
        if (searchId){
            res.status(200).send(searchId)
        }else {
            res.status(404).send ({
                id:req.params.id,
                product: `product ${req.params.id} does not exist in the database`
            })
        }
        
    })
    
    
    
    
    router.post("/products", (req,res)=>{
    
        const newProduct={
            id:JSON.parse(fs.readFileSync("./products.json")).length+1,
            title:req.body.title,
            description:req.body.description,
            code:req.body.code,
            price:parseInt(req.body.price),
            status:true,
            stock:parseInt(req.body.stock),
            category:req.body.category,
            thumbnail:[req.body.thumbnail]
        }
    
        const repited= productsParse.find(prod =>{
            return prod.code == req.body.code
        })
    
        if(repited){
            res.status(404).send("The product already exists in the database")
        }else if(req.body.title != undefined && req.body.description != undefined && req.body.code != undefined && req.body.price != undefined && req.body.stock != null && req.body.category != undefined){
            productsParse.push(newProduct)
            res.status(200).send(productsParse)
            fs.writeFileSync("./src/products.json",JSON.stringify(productsParse))
    
        }else {
            res.status(404).send("Incomplete field")
        }
            
    })
    
    
    router.put("/products/:id",(req,res)=>{
    
        const updated=productsParse.find(prod =>{
            return prod.id == req.params.id
        })
    
    
        if(updated){
    
            const updatedProduct= {...updated,...req.body}
    
            const notUpdate= productsParse.filter(prod=>{
                return prod.id != req.params.id
            })    
            notUpdate.push(updatedProduct)
            
            fs.writeFileSync("./src/products.json",JSON.stringify(notUpdate))
            res.status(200).send(updatedProduct)
    
        } else{
            res.status(404).send(`the product ${req.params.id} does not exist`)
        }
        
    })
    
    
    
    router.delete("/products/:id",(req,res)=>{
    
        const deleted= productsParse.find(prod=>{
            return prod.id == req.params.id
        }) 
    
        if(deleted){
            const withoutRemoved= productsParse.filter(prod=>{
                return prod.id != deleted.id
            })
            fs.writeFileSync("./src/products.json",JSON.stringify(withoutRemoved))
            res.status(200).send(withoutRemoved)
        } else{
            res.status(404).send(`the product with the id:${req.params.id} does not exist in the database`)
        }
    
    })
    
    
    router.get("/home",(req,res)=>{
        res.render("home",{productsParse})
    })
    
    
    router.get("/realtimeproducts",(req,res)=>{
        res.render("realTimeProducts",{productsParse})
        io.emit("newProduct",req.body)
    })
    
    return router
}

export default productsRoutes


 

// export default router
