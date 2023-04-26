import express from "express";
import router from "./src/routes/products.routes.js";
import routerCart from "./src/routes/carts.routes.js"
import { __dirname } from "./utils.js";


const port= 8080;
const server= express();
server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use("/api",router)
server.use("/api",routerCart)
server.use("/public", express.static(`${__dirname}/src/public`))

server.listen(port,()=>{
    console.log("server on");
}) 