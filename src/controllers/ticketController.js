import cartModel from "../models/dao/models/cart.model.js";
import ticketModel from "../models/dao/models/tickets.model.js";
import productModel from "../models/dao/models/products.model.js";

export const newPurchase = async (req,res)=>{

    try{
        const idCart= req.session.user.cart._id
        const user= req.session.user.userName
        const cart= await cartModel.findById(idCart).populate({
            path: "products.product",
            select: "description price stock"
            });

        const {products} = cart
        const finalPrice= products.reduce((acc,curr)=>{
            return acc + (curr.product.price * curr.quantity)
        },0)

        const code= Math.floor(Math.random()*1000000).toString()
        
        const date= new Date()
        const dateTime= date.toLocaleString()

        const ticket= {
            code: code,
            purchase_datetime: dateTime,
            amount: finalPrice,
            purchaser: user,
            message:""
            
        }

        const everyStock= products.every(prod =>{
            return prod.quantity < prod.product.stock
            })

            
        const inStock= products.filter(prod=>{
            return prod.product.stock > prod.quantity
        })
        
        
        const nostock= products.filter(prod=>{
            return prod.product.stock < prod.quantity
        })

        if(everyStock){

            products.map(async prod=>{
                await productModel.findByIdAndUpdate({_id:prod.product._id},
                {$inc: {stock: -prod.quantity}},
                {new: true})
            })
            // await cartModel.findByIdAndUpdate(
            //     {_id:idCart},
            //     {$set: {products: []}},
            //     {new: true}
            //   );
            ticket.message= "Todos los productos han sido comprados con exito"
            res.send(await ticketModel.create(ticket))
        }else if(inStock){

            inStock.map(async prod=>{
                await productModel.findByIdAndUpdate({_id:prod.product._id},
                {$inc: {stock: -prod.quantity}},
                {new: true})
            })
            // await cartModel.findByIdAndUpdate(
            //     {_id:idCart},
            //     {$set: {products: nostock}},
            //     {new: true}
            //   );
            ticket.message=  `compra realizada, el producto ${nostock[0].product.description}, no a podido ser comprado ya que su cantidad de compra (${nostock[0].quantity}), excede la cantidad en stock (${nostock[0].product.stock})`
            res.send(await ticketModel.create(ticket)) 
        }else{

            res.send(nostock)
        }
    
    } catch(err){
        console.log(Error)
        res.status(400).send(err)
    }
    
        

          

       


        
  



}