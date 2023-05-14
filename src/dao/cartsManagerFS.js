import fs from "fs";


class CartManager{

    constructor(path){
        this.path=path
        this.carts= []
    }

    getCarts=()=>{
        return JSON.parse(fs.readFileSync("./src/carts.json"))
    }

    newCart=()=>{
        const oneCart={
            id:this.getCarts().length+1,
            products:[]
        }
        const carts= this.getCarts()
        carts.push(oneCart)
        fs.writeFileSync("./src/carts.json",JSON.stringify(carts))
        return oneCart
    }

    cartProducts=(id)=>{
        const cId= this.getCarts().find(prod=>{
            return prod.id == id
        })
        if(cId){
            return cId.products
        }  
    }

    cartsInCart=(Cid,Pid)=>{
        const cartId= this.getCarts().find((prod)=>{
            return prod.id == Cid
        })
    
        const productInCart= cartId.products.find(prod=>{
            return prod.product == Pid
        })
    

        if(productInCart){
            productInCart.quantity=productInCart.quantity+1
            const newcart= this.getCarts().filter(cart=>{
                return cart.id != cartId.id
            })
            newcart.push(cartId)
            fs.writeFileSync("./src/carts.json",(JSON.stringify(newcart)))
        }else{
            cartId.products.push({product: Pid, quantity:1})
            const newCarts=this.getCarts().filter(cart=>{
                return cart.id != cartId.id
            })
            newCarts.push(cartId)
            fs.writeFileSync("./src/carts.json",JSON.stringify(newCarts))
        }

    
        return cartId




    }




}

export default CartManager