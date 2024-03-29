import Carts from "../services/cartsManagerDB.js";
//import Carts from "../services/cartsManagerFS.js";
import cartModel from "../models/dao/models/cart.model.js";
import { Router } from "express";


const cart= new Carts

export const getCarts= async (req,res,next)=>{
    try{
        res.status(200).send(await cart.getCarts())
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const newCart= async (req,res,next)=>{
    try{
        res.status(200).send(await cart.newCart())
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const cartProducts= async (req,res,next)=>{
    try{
        res.status(200).send(await cart.cartProducts(req.params.id))
        
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}


export const productsInCart= async (req,res,next)=>{
    try{
        res.status(200).send(await cart.productsInCart(req.params.cid,req.params.pid))
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

//funciones solo en db 


export const deleteProductInCart= async (req,res,next)=>{
    try{
        res.status(200).send(await cart.deleteProductInCart(req.params.cid,req.params.pid))
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const updateQuantity= async (req,res,next)=>{
    try{
        const { quantity } = req.body;
        res.status(200).send(await cart.updateQuantity(req.params.cid, req.params.pid, quantity))
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const deleteProducts= async(req,res,next)=>{
    try{
        res.status(200).send(await cart.deleteProducts(req.params.cid))
    }catch(err){
        req.logger.error(err)
        next(err)
    }
}

export const cartViews= async(req,res,next)=>{
    try{
    const response=  await cart.cartsViews(req.params.cid)
    
    res.render("carts",{data:response})
   
    }catch(err){
        req.logger.error(err)
        next(err)
    }
    
}