import { Router } from "express";
// import ProductsManager from "../dao/productManagerFS.js";
import ProductsManager from "../services/productManagerFS.js";

const manager=new ProductsManager("./src/products.json")
const products= manager.fsProducts()

const viewsRouter=(io)=>{
    const router=Router()

    router.get("/home",(req,res)=>{
        res.render("home",{products})

    })

    router.post("/realtimeproducts",(req,res)=>{
        res.render("realTimeProducts",{products})
        io.emit("newProduct",req.body)
    })

    return router

}




export default viewsRouter