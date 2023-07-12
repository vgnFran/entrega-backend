import mongoose from "mongoose";
import cartModel from "../models/dao/models/cart.model.js";
import productModel from "../models/dao/models/products.model.js";

export default class Carts{

    constructor(){
        this.id= 1
    }

    getCarts = async () => {
        try {
          return await cartModel
            .find()
            .populate("products");
        } catch (err) {
          return err;
        }
      };
      

    newCart= async ()=>{
        try{
            const oneCart={
                products:[]
            }
            return await cartModel.create({oneCart}) 

        }catch(err){
            return err
        }
    }

    cartProducts= async (id)=>{
        try{
            const search= await cartModel.findById(id)
            return search.products
        }catch(err){
            return err
        }
    }


    productsInCart= async ()=>{
        try{
            const found= await cartModel.findOneAndUpdate(
                {_id:req.params.cid, "products._id":req.params.pid },
                {$inc: {"products.$.quantity": 1}},
                {new: true}
                            
            )
            
            if(found){
                return found
            }
    
        }catch{
                
            const newProduct= {quantity:1}
            const updateCart= await cartModel.findOneAndUpdate(
                {_id:req.params.cid},
                {$push: {products: newProduct} },
                {new: true}
            )
            return updateCart
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
            return err
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
            return err
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
            return err
        }
    }

    cartsViews= async(cid)=>{
        try{
            const carts= await cartModel.findOne({_id:cid}).lean()
            const cart=carts.products
            return cart
        }catch(err){
           return err
        }
    }








}

