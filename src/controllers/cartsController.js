import Carts from "../services/cartsManagerDB.js";
//import Carts from "../services/cartsManagerFS.js";
import cartModel from "../models/dao/models/cart.model.js";
import { Router } from "express";


const cart= new Carts

export const getCarts= async (req,res)=>{
    try{
        res.status(200).send(await cart.getCarts())
    }catch(err){
        res.status(400).send(err)
    }
}

export const newCart= async (req,res)=>{
    try{
        res.status(200).send(await cart.newCart())
    }catch(err){
        res.status(400).send(err)
    }
}

export const cartProducts= async (req,res)=>{
    try{
        res.status(200).send(await cart.cartProducts(req.params.id))
    }catch(err){
        res.status(400).send(err)
    }
}


export const productsInCart= async (req,res)=>{
    try{
        res.status(200).send(await cart.productsInCart(req.params.cid,req.params.pid))
    }catch(err){
        res.status(400).send(err)
    }
}

//funciones solo en db 


export const deleteProductInCart= async (req,res)=>{
    try{
        res.status(200).send(await cart.deleteProductInCart())
    }catch(err){
        res.status(400).send(err)
    }
}

export const updateQuantity= async (req,res)=>{
    try{
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        res.status(200).send(await cart.updateQuantity(cid, pid, quantity))
    }catch(err){
        res.status(400).send(err)
    }
}

export const deleteProducts= async(req,res)=>{
    try{
        const {cid} = req.params;
        res.status(200).send(await cart.deleteProducts(cid))
    }catch(err){
        res.status(400).send(err)
    }
}

export const cartViews= async(req,res)=>{
    try{
    const cid = req.params.cid
    const response=  await cart.cartsViews(cid)
    
    res.render("carts",{data:response})
   
    }catch(err){
        res.status(400).send(err)
    }
    
}