import mongoose from "mongoose";
import cartModel from "./models/cart.model.js";

class cartsManagerDB{

    constructor(){
        this.id= 1
    }

    getCarts= async()=>{
        try{
            return await cartModel.find()
        }catch(err){
            return err
        }
    }

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


    cartsInCart= async (cid,pid)=>{
        const id= this.id


        try{
           return await cartModel.findByIdAndUpdate({"_id":new mongoose.Types.ObjectId(cid)},
            {
                products:[{"_id":new mongoose.Types.ObjectId(pid), quantity:10}]
            }

            )
        }catch(err){
            return await this.newCart()
        }


    }





}

export default cartsManagerDB