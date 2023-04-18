const express= require("express");
const router= require("./src/routes/products.routes");
const routerCart= require("./src/routes/carts.routes")


const port= 8080;
const server= express();
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use("/api",router)
server.use("/api",routerCart)


server.listen(port,()=>{
    console.log("server on");
})