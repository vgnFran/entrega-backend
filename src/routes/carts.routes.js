const express= require("express")
const router= express.Router()
const fs=require("fs")

const carts=JSON.parse(fs.readFileSync("./src/carts.json"))



router.post("/carts", (req,res)=>{
    const newCart={
        id:JSON.parse(fs.readFileSync("./src/carts.json")).length+1,
        products:[]
    }
    res.status(200).send(newCart)
    carts.push(newCart)
    fs.writeFileSync("./src/carts.json",JSON.stringify(carts))
    
})

router.get("/carts/:id",(req,res)=>{
    const cId= carts.find(prod=>{
        return prod.id == req.params.id
    })
    if(cId){
        res.status(200).send(cId.products)   
    }else{
        res.status(404).send(`cart:${req.params.id} does not exist in the database`)
    }
    
})

router.post("/carts/:cid/products/:pid",(req,res)=>{
    
    const cartId= carts.find((prod)=>{
        return prod.id == req.params.cid
    })

    const productInCart= cartId.products.find(prod=>{
        return prod.product == req.params.pid
    })


    if(productInCart){
        productInCart.quantity= productInCart.quantity +1
        fs.writeFileSync("./src/carts.json",JSON.stringify(carts))
        res.status(200).send(productInCart)
        
    } else{
        cartId.products.push({product:req.params.pid, quantity:1})
        const cartProducts= carts.filter(prod=>{
            return prod.id != cartId.id
        })
        cartProducts.push(cartId)
        fs.writeFileSync("./src/carts.json",JSON.stringify(cartProducts))
        res.status(200).send(cartId)        
     }
           
})







module.exports= router;