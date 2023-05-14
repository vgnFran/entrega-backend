import fs from "fs"

class ProductsManager{
    static id= 0
    constructor(path){
        this.path=path
        this.products=[]
    }

    

    fsProducts= ()=>{
        return JSON.parse(fs.readFileSync(this.path,"utf-8"))
    }


    getProductsById=(id)=>{
        const filtered= this.fsProducts().find(prod=>{
            return prod.id == id
        })
        return filtered
     }


    createProduct=(data)=>{

        const newId= prod1.fsProducts().pop().id+1

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
            const notUpdate= this.fsProducts().filter(prod=>{
                return prod.id !=  update.id
            })
             
            notUpdate.push(updatedProduct)
            fs.writeFileSync("./src/products.json",JSON.stringify(notUpdate))
            return updatedProduct
       
    }

    deleteProduct=(deleted)=>{

        if(deleted){
            const withoutRemoved= productsParse.filter(prod=>{
                return prod.id != deleted.id
            })
            fs.writeFileSync("./src/products.json",JSON.stringify(withoutRemoved))
        }
    }


}

export default ProductsManager






