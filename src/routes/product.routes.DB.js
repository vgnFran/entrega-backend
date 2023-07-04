import { Router } from "express";
import { getProductsById, getProducts, productsViews, createProduct, updateProduct, deleteProduct } from "../controllers/productControllerDB.js";

const router= Router()

    router.get("/products/:id",getProductsById)

    // CON EL ENDPOINT /PRODUCTS TRAEMOS TODOS LOS PRODUCTOS
    // CON EL ENDPOINT /PRODUCTS/ID TRAEMOS SOLO EL PRODUCTO CON ESE ID 
    // CON EL ENDPOINT /PRODUCTS?QUERY=QUERY TRAEMOS LOS PRODUCTOS FILTRADOS CON LA CATEGORIA PASADA POR QUERY, POR EJEMPLO: /PRODUCTS?QUERY=NOTEBOOK TRAEMOS SOLO LAS NOTEBOOKS
    //EJ: http://localhost:8080/api/products?category=notebook&limit=1&page=2&sort=-1 FILTRAMOS POR NOTEBOOK, LIMITE DE 1 PRODUCTO, PAGINA 2 Y PRECIO DESCENDENTE



    router.get("/products?",getProducts)    
   
   
    // CON EL ENDPOINT /productsViews renderizamos una plantilla con todos los productos, agrengando params podemos filtrar, ej: productsViews?category=iphone&limit=5&page=1&sort=-1, veremos solamente los productos categoria iphone, limite de 5, su primera pagina y ordenados por precio
    router.get("/productsViews?",productsViews)


    router.post("/products", createProduct)


    router.put("/products/:id", updateProduct)


    router.delete("/products/:id", deleteProduct)






export default router