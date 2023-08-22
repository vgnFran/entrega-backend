
import mongoose from "mongoose";
import productModel from "../models/dao/models/products.model.js";
import errorManager from "./errorManager.js";
import { dictionary } from "../utils/dictionary.js";


export default class Product{

    constructor(){
        this.products=[]
    }

    getProducts= async ()=>{

        try{
            const products= await productModel.find().lean()
            return  products
        }catch{
            req.logger.error(err)
            throw new errorManager(dictionary.notFound)
        }
        
    }



    getProductsById=async (id)=>{
       try{
        const product= await productModel.findById(id)
        return product
       }catch(err){
        req.logger.error(err)
        throw new errorManager(dictionary.nonExistent)
       }
        
    }

    createProduct= async(data,user)=>{
        console.log(user)
        if(user.rol == "premium"){
            const newProduct={
                title:data.title,
                description:data.description,
                code:data.code,
                price:data.price,
                status:true,
                stock:data.stock,
                category:data.category
            }

            const values = Object.values(newProduct)
            const completeImputs= values.map(val=>{
                return val== null
            })
            
            const productsList= await productModel.find()
            const repited= productsList.find(prod=>{
                return prod.code == data.code
            })
    
            if(completeImputs.includes(true)){
                throw new errorManager(dictionary.incompleteField)
            }else if(repited){
                throw new errorManager(dictionary.alreadyExists)               
            }else{
                return await productModel.create(newProduct)
            }

        }else{

            throw new errorManager(dictionary.unauthorized)
        }


    }

    updateProduct= async (id,data,req) =>{
        try{
            return await productModel.updateOne({"_id":new mongoose.Types.ObjectId(id)},data)     
        }catch(err){
            req.logger.error(err)
            throw new errorManager(dictionary.nonExistent)
        }
    }

    deleteProduct= async(id, user)=>{
        try{
            if(user.rol == "premium" && user.owner == user.email){
                return await productModel.deleteOne({"_id":new mongoose.Types.ObjectId(id)})
            }else if(user.rol == "admin"){
                return await productModel.deleteOne({"_id":new mongoose.Types.ObjectId(id)})
            }else{
                throw new errorManager(dictionary.unauthorized) 
            }
            
        }catch(err){
            req.logger.error(err)
            throw new errorManager(dictionary.nonExistent)
        }
    }
    
    
}

