import fs from "fs"

class ProductsManager{
    static id= 0
    constructor(path){
        this.path=path
        this.products=[]
    }


    getProducts= ()=>{
        return JSON.parse(fs.readFileSync(this.path,"utf-8"))
    }
    
    getProductsById=(id)=>{
        const filtered= this.getProducts().find(prod=>{
            return prod.id == id
        })
        if(filtered){
            return filtered
        }else{
            return `product ${id} does not exist in the database`
        }
    }

    updatePoducts=(id,data)=>{
        const update= this.getProductsById(id)
        if(update){
            const updatedProduct= {...update,...data}
            return updatedProduct
        }else{
            return 
        }
       
    }

    
}




const prod1= new ProductsManager("./src/products.json")
console.log(prod1.updatePoducts(11,{title:"pc vieja"}))
