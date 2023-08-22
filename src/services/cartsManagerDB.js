import mongoose from "mongoose";
import cartModel from "../models/dao/models/cart.model.js";
import productModel from "../models/dao/models/products.model.js";
import errorManager from "./errorManager.js";
import { dictionary } from "../utils/dictionary.js";
import Product from "./productManagerDB.js";

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
            const found= await cartModel.findById(cid)
            const coincidence= found.products.find(prod =>{
                return prod.product == pid
            })

            if(coincidence){
                const increment= await cartModel.findOneAndUpdate({_id:cid, "products.product":pid }, {$inc: {"products.$.quantity": 1}}, {new:true})
                return increment
            }else{
                const newProduct= {quantity:1, product:pid.toString()}
                const create= await cartModel.findOneAndUpdate({_id:cid}, {$push: {products: newProduct} }, {new: true})
                return create
            }
        }catch(err){
            req.logger.error(err)
            throw new errorManager(dictionary.notFound)
        } 
    }

    deleteProductInCart= async (cid,pid)=>{
        try{
            const deleteProduct= await cartModel.findOneAndUpdate(
                {_id:cid},
                {$pull: {products: {product:pid}}},
                {new: true}
            )
            console.log("hola")
            return deleteProduct
        }catch(err){
            throw new errorManager(dictionary.nonExistent)
        }
        
    }

    updateQuantity= async (cid, pid, quantity)=>{
        try{
            const updateQuantity= await cartModel.findOneAndUpdate(
                {_id:cid, "products.product":pid },
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

