import mongoose from "mongoose";
import cartModel from "../models/dao/models/cart.model.js";
import productModel from "../models/dao/models/products.model.js";
import errorManager from "./errorManager.js";
import { dictionary } from "../utils/dictionary.js";

export default class Carts{

    constructor(){
        this.id= 1
    }

    getCarts = async () => {
        try {
          return await cartModel
            .find()
            .populate({path: "products.product"})
        } catch (err) {
            throw new errorManager(dictionary.notFound)
        }
      };
      

    newCart= async ()=>{
        try{
            const oneCart={
                products:[]
            }
            return await cartModel.create({oneCart}) 

        }catch(err){
            throw new errorManager(dictionary.notFound)
        }
    }

    cartProducts= async (id)=>{
        try{
            const search= await cartModel.findById(id)
            return search.products
        }catch(err){
           throw new errorManager(dictionary.nonExistent)
        }
    }


    productsInCart= async (cid,pid)=>{
        try{
            const found= await cartModel.findOneAndUpdate(
                {_id:cid, "products._id":pid },
                {$inc: {"products.$.quantity": 1}},
                {new: true}           
            )
            if(found){
                return found
            }else{
                
                const product= pid
                product.toString()
                const newProduct= {quantity:1, product:product}
                const updateCart= await cartModel.findOneAndUpdate(
                    {_id:cid},
                    {$push: {products: newProduct} },
                    {new: true}
                )
                return updateCart
            }

        }catch(err){
            throw new errorManager(dictionary.notFound)
        } 
    }

    deleteProductInCart= async ()=>{
        try{
            const deleteProduct= await cartModel.findOneAndUpdate(
                {_id:req.params.cid},
                {$pull: {products: {_id:req.params.pid}}},
                {new: true}
            )
            return deleteProduct
        }catch(err){
            throw new errorManager(dictionary.nonExistent)
        }
        
    }

    updateQuantity= async (cid, pid, quantity)=>{
        try{
            const updateQuantity= await cartModel.findOneAndUpdate(
                {_id:cid, "products._id":pid },
                {$set: {"products.$.quantity": quantity}},
                {new:true}
            )
            return updateQuantity
        }catch(err){
            throw new errorManager(dictionary.nonExistent)
        }
    }


    deleteProducts= async (cid)=>{
        try{
            const deleteProducts= await cartModel.findOneAndUpdate(
                {_id:cid},
                {$set: {products:[]}},
                {new: true}
            ) 
            return deleteProducts
        }catch(err){
            throw new errorManager(dictionary.nonExistent)
        }
    }

    cartsViews= async(cid)=>{
        try{
            const carts= await cartModel.findOne({_id:cid}).lean()
            const cart=carts.products
            return cart
        }catch(err){
            throw new errorManager(dictionary.nonExistent)
        }
    }








}

