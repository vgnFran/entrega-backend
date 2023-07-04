import fs from "fs"

export default class Product{
    static id= 0
    constructor(){
        this.path="./src/products.json"
        this.products=[]
    }

    

    getProducts= ()=>{
        return JSON.parse(fs.readFileSync(this.path,"utf-8"))
    }


    getProductsById=(id)=>{
        const filtered= this.getProducts().find(prod=>{
            return prod.id == id
        })
        return filtered
     }


    createProduct=(data)=>{

        const newId= prod1.getProducts().pop().id+1

        const newProduct={
            id:newId,
            title:data.title,
            description:data.description,
            code:data.code,
            price:data.price,
            status:true,
            stock:data.stock,
            category:data.category,
            thumbnail:data.thumbnail
        }
        return newProduct

    }


    updatePoduct=(update,data)=>{

            const updatedProduct= {...update,...data}
            const notUpdate= this.getProducts().filter(prod=>{
                return prod.id !=  update.id
            })
             
            notUpdate.push(updatedProduct)
            fs.writeFileSync("./src/products.json",JSON.stringify(notUpdate))
            return updatedProduct
       
    }

    deleteProduct=(id)=>{
       
        const withoutRemoved= this.getProducts().filter(prod=>{
            return prod.id != id
        })
        
        fs.writeFileSync("./src/products.json",JSON.stringify(withoutRemoved))
        return withoutRemoved
    }


}








