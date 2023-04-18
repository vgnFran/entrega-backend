const express= require("express")
const router= express.Router()
const fs=require("fs")

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

// primero buscamos el producto con el parametro, luego con un campo llamado key enviamos el campo que queremos modificar, y con otro campo llamado value enviamos el valor actualizado

router.put("/products/:id",(req,res)=>{
    const updated=productsParse.find(prod =>{
        return prod.id == req.params.id
    })
    const key= req.body.key
    const value=parseInt(req.body.value)

    if(updated && key != undefined && value != null){
        updated[key]=value

        const notUpdate= productsParse.filter(prod=>{
            return prod.id != req.params.id
        })

        notUpdate.push(updated)
        res.status(200).send(notUpdate)
        fs.writeFileSync("./src/products.json",JSON.stringify(notUpdate))

    } else{
        res.status(404)
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


module.exports= router;