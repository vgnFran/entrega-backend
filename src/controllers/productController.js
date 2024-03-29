import Product from "../services/productManagerDB.js";
import MockProduct from "../services/productManagerMock.js";
import productModel from "../models/dao/models/products.model.js";
// import errorManager from "./src/services/errorManager.js";
import errorManager from "../services/errorManager.js";
import { dictionary } from "../utils/dictionary.js";
//importar para usar FS en vez de DB
// import Product from "../services/productManagerFS.js";


const product= new Product
const mockProduct= new MockProduct

export  const getProductsById= async (req,res)=>{
    try{
        res.status(200).send(await product.getProductsById(req.params.id))
    }catch{
        req.logger.error(err)
        next(err)
    }
}

export const getProducts= async (req,res)=>{
    try{        
        if(req.query.category != undefined){

            const process= await productModel.paginate( {category:req.query.category},{page:req.query.page, limit:req.query.limit || 10, sort:{price:req.query.sort}})
            res.status(200).send(process)
        }
        else{            
            res.status(200).send(await product.getProducts())
        }                       
    }catch(err){
        req.logger.error(err)
        next(err)

    } 
}

export const productsViews = async (req,res)=>{
    try{
        if(req.query.category != undefined){

            const docs= await productModel.paginate( {category:req.query.category},{page:req.query.page, limit:req.query.limit || 10, sort:{price:req.query.sort},lean:true})
            const products= docs.docs
            res.render("products",{products})
        }
        else{
            const products= await product.getProducts()            
            res.render("products",{products})
        }  
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const createProduct = async (req,res,next)=>{
        try{
            const newProduct= await product.createProduct(req.body,req.sessionStore.user)
            res.status(200).send(newProduct)
       }catch(err){
        console.log(err)
            req.logger.error(err)
            next(err)
       }
}

export const updateProduct= async (req,res,next)=>{
        try{  
            const id= req.params.id
            const body= req.body   
            res.status(200).send(await product.updateProduct(id,body,req))          
        }catch(err){
            req.logger.error(err)
            next(err)
        }
}

export const deleteProduct= async (req,res, next)=>{
    try{
        const deleted= await product.deleteProduct(req.params.id, req.sessionStore.user)
        res.status(200).send(deleted)
        
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const generateProductMock= (req,res,next)=> {
    try{
        res.send(mockProduct.generateProduct(20))
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}




