
import mongoose from "mongoose";
import productModel from "../models/dao/models/products.model.js";


export default class Product{

    constructor(){
        this.products=[]
    }

    getProducts= async ()=>{

        try{
            const products= await productModel.find().lean()
            return  products
        }catch{
            console.log("error")
        }
        
    }



    getProductsById=async (id)=>{
       try{
        const product= await productModel.findById(id)
        return product
       }catch(err){
        return `product id: ${id} does not exist in the database`      
       }
        
    }

    createProduct= async(data)=>{
        const findID= await productModel.findOne()
        const newID= findID._id+1
        const newProduct={
            id:newID,
            title:data.title,
            description:data.description,
            code:data.code,
            price:data.price,
            status:true,
            stock:data.stock,
            category:data.category,
            thumbnail:data.thumbnail
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
            return "incomplete field"
        }else if(repited){
            return "the product alredy exists in the database"
        }else{
            await productModel.create(newProduct)

        }

    }

    updateProduct= async (id,data) =>{
        try{
            console.log(id)
            return await productModel.updateOne({"_id":new mongoose.Types.ObjectId(id)},data)     
        }catch(err){
            return `product id: ${id} does not exist in the database` 
        }
    }

    deleteProduct= async(id)=>{
        try{
            return await productModel.deleteOne({"_id":new mongoose.Types.ObjectId(id)})
        }catch(err){
            return `product id: ${id} does not exist in the database` 
        }
    }

}

